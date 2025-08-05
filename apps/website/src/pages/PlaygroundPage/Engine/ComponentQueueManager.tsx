import React from 'react';
import { ComponentSchema } from '../Schema';

// 队列任务接口
interface QueueTask {
	id: string;
	schema: ComponentSchema;
	key?: string;
	priority: number;
	resolve: (component: React.ReactNode) => void;
	reject: (error: Error) => void;
}

// 队列管理器配置
interface QueueConfig {
	maxConcurrent: number; // 最大并发解析数量
	batchSize: number; // 每批处理的组件数量
	delay: number; // 批次间的延迟时间(ms)
	priorityLevels: number; // 优先级级别数量
}

// 默认配置
const DEFAULT_CONFIG: QueueConfig = {
	maxConcurrent: 3,
	batchSize: 5,
	delay: 50,
	priorityLevels: 3,
};

// 加载中组件
const LoadingComponent: React.FC<{ key?: string }> = ({ key }) => (
	<div
		key={key}
		style={{
			padding: '8px 12px',
			border: '1px dashed #d9d9d9',
			borderRadius: '6px',
			backgroundColor: '#fafafa',
			color: '#999',
			fontSize: '12px',
			textAlign: 'center',
			minHeight: '32px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		解析中...
	</div>
);

export class ComponentQueueManager {
	private config: QueueConfig;
	private queue: QueueTask[] = [];
	private processing: Set<string> = new Set();
	private isRunning = false;
	private renderFunction: (
		schema: ComponentSchema,
		key?: string
	) => React.ReactNode;

	constructor(
		renderFunction: (schema: ComponentSchema, key?: string) => React.ReactNode,
		config: Partial<QueueConfig> = {}
	) {
		this.config = { ...DEFAULT_CONFIG, ...config };
		this.renderFunction = renderFunction;
	}

	// 添加组件到队列
	public addToQueue(
		schema: ComponentSchema,
		key?: string,
		priority: number = 0
	): Promise<React.ReactNode> {
		return new Promise((resolve, reject) => {
			const task: QueueTask = {
				id: key || `task-${Date.now()}-${Math.random()}`,
				schema,
				key,
				priority,
				resolve,
				reject,
			};

			// 按优先级插入队列
			this.insertTaskByPriority(task);

			// 启动队列处理
			this.startProcessing();
		});
	}

	// 按优先级插入任务
	private insertTaskByPriority(task: QueueTask): void {
		const insertIndex = this.queue.findIndex((t) => t.priority < task.priority);
		if (insertIndex === -1) {
			this.queue.push(task);
		} else {
			this.queue.splice(insertIndex, 0, task);
		}
	}

	// 启动队列处理
	private async startProcessing(): Promise<void> {
		if (this.isRunning) return;

		this.isRunning = true;

		while (this.queue.length > 0 || this.processing.size > 0) {
			// 处理当前批次
			await this.processBatch();

			// 批次间延迟
			if (this.queue.length > 0) {
				await this.delay(this.config.delay);
			}
		}

		this.isRunning = false;
	}

	// 处理一批任务
	private async processBatch(): Promise<void> {
		const batch: QueueTask[] = [];

		// 获取当前批次的任务
		while (
			batch.length < this.config.batchSize &&
			this.queue.length > 0 &&
			this.processing.size < this.config.maxConcurrent
		) {
			const task = this.queue.shift()!;
			batch.push(task);
			this.processing.add(task.id);
		}

		if (batch.length === 0) return;

		// 并发处理批次中的任务
		const promises = batch.map((task) => this.processTask(task));
		await Promise.allSettled(promises);
	}

	// 处理单个任务
	private async processTask(task: QueueTask): Promise<void> {
		try {
			// 使用 requestIdleCallback 在空闲时间处理
			const component = await this.processWithIdleCallback(task);
			task.resolve(component);
		} catch (error) {
			task.reject(error as Error);
		} finally {
			this.processing.delete(task.id);
		}
	}

	// 在空闲时间处理任务
	private processWithIdleCallback(task: QueueTask): Promise<React.ReactNode> {
		return new Promise((resolve) => {
			if ('requestIdleCallback' in window) {
				(window as any).requestIdleCallback(
					() => {
						try {
							const component = this.renderFunction(task.schema, task.key);
							resolve(component);
						} catch (error) {
							console.warn('组件渲染失败:', error);
							resolve(LoadingComponent({ key: task.key }));
						}
					},
					{ timeout: 1000 }
				);
			} else {
				// 降级处理：使用 setTimeout
				setTimeout(() => {
					try {
						const component = this.renderFunction(task.schema, task.key);
						resolve(component);
					} catch (error) {
						console.warn('组件渲染失败:', error);
						resolve(LoadingComponent({ key: task.key }));
					}
				}, 0);
			}
		});
	}

	// 延迟函数
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// 获取队列状态
	public getStatus(): {
		queueLength: number;
		processingCount: number;
		isRunning: boolean;
	} {
		return {
			queueLength: this.queue.length,
			processingCount: this.processing.size,
			isRunning: this.isRunning,
		};
	}

	// 清空队列
	public clearQueue(): void {
		this.queue.forEach((task) => {
			task.reject(new Error('队列已清空'));
		});
		this.queue = [];
		this.processing.clear();
	}

	// 暂停队列处理
	public pause(): void {
		this.isRunning = false;
	}

	// 恢复队列处理
	public resume(): void {
		if (!this.isRunning) {
			this.startProcessing();
		}
	}

	// 更新配置
	public updateConfig(newConfig: Partial<QueueConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}
}

// 批量渲染组件的 Hook
export function useComponentQueue(
	renderFunction: (schema: ComponentSchema, key?: string) => React.ReactNode,
	config?: Partial<QueueConfig>
) {
	const [queueManager] = React.useState(
		() => new ComponentQueueManager(renderFunction, config)
	);

	const renderWithQueue = React.useCallback(
		async (schema: ComponentSchema, key?: string, priority?: number) => {
			return queueManager.addToQueue(schema, key, priority);
		},
		[queueManager]
	);

	const getStatus = React.useCallback(() => {
		return queueManager.getStatus();
	}, [queueManager]);

	const clearQueue = React.useCallback(() => {
		queueManager.clearQueue();
	}, [queueManager]);

	const updateConfig = React.useCallback(
		(newConfig: Partial<QueueConfig>) => {
			queueManager.updateConfig(newConfig);
		},
		[queueManager]
	);

	return {
		renderWithQueue,
		getStatus,
		clearQueue,
		updateConfig,
		queueManager,
	};
}
