// 统一调度中心
export class Scheduler {
	private queue: Array<() => Promise<void>> = [];
	private currentRunning = 0;
	private maxConcurrent = 5;

	constructor(maxConcurrent: number = 5) {
		this.maxConcurrent = maxConcurrent;
	}

	add(task: () => Promise<void>): void {
		this.queue.push(task);
		this.process();
	}

	private process(): void {
		// 只要有空位且队列不空，就启动新任务
		if (this.currentRunning >= this.maxConcurrent) return;
		if (this.queue.length === 0) return;

		const task = this.queue.shift();
		if (task) {
			this.currentRunning++;
			task()
				.catch(() => {})
				.finally(() => {
					this.currentRunning--;
					this.process(); // 递归拉取新任务
				});
		}
	}

	setMaxConcurrent(max: number): void {
		this.maxConcurrent = max;
	}

	getCurrentRunning(): number {
		return this.currentRunning;
	}

	getQueueLength(): number {
		return this.queue.length;
	}

	isRunning(): boolean {
		return this.currentRunning > 0 || this.queue.length > 0;
	}

	clear(): void {
		this.queue = [];
	}

	async waitForCompletion(): Promise<void> {
		return new Promise((resolve) => {
			const check = () => {
				if (!this.isRunning()) {
					resolve();
				} else {
					setTimeout(check, 50);
				}
			};
			check();
		});
	}
}
