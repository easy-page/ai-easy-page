import React from 'react';
import { Form, FormStore, FieldValue, FormItem, When } from '@easy-page/core';
import { FormSchema, ComponentSchema } from '../Schema';
import {
	FunctionProperty,
	ReactNodeProperty,
	FunctionReactNodeProperty,
} from '../Schema/specialProperties';
import { JSXParser, ComponentMapper } from '../JSXParser';
import {
	ComponentQueueManager,
	useComponentQueue,
} from './ComponentQueueManager';
import { createFunctionFromString } from './functionParser';
import { DEFAULT_COMPONENT_MAP } from '../constant/componentMap';

// 使用统一的组件映射表

// 事件处理函数类型
type SubmitHandler = (
	values: Record<string, FieldValue>,
	store: FormStore
) => void | Promise<void>;
type ValuesChangeHandler = (
	changedValues: Record<string, FieldValue>,
	allValues: Record<string, FieldValue>
) => void;

// 默认的事件处理函数
const DEFAULT_HANDLERS: Record<string, SubmitHandler | ValuesChangeHandler> = {
	handleSubmit: async (
		values: Record<string, FieldValue>,
		store: FormStore
	) => {
		console.log('基础表单提交:', values);
	},
	handleValuesChange: (
		changedValues: Record<string, FieldValue>,
		allValues: Record<string, FieldValue>
	) => {
		console.log('值变化:', changedValues, allValues);
	},
};

// 处理函数属性，将FunctionProperty转换为实际函数
const processFunctionProperty = (
	funcProp: FunctionProperty | undefined
): any => {
	if (!funcProp || funcProp.type !== 'function') {
		return undefined;
	}

	return createFunctionFromString(funcProp.content);
};

// 处理ReactNode属性，将ReactNodeProperty转换为React节点
const processReactNodeProperty = (
	nodeProp: ReactNodeProperty | undefined,
	jsxParser: JSXParser,
	renderComponent?: (schema: ComponentSchema, key?: string) => React.ReactNode
): React.ReactNode => {
	if (!nodeProp) {
		return undefined;
	}

	// 处理字符串类型的 ReactNodeProperty
	if (
		nodeProp.type === 'reactNode' &&
		'content' in nodeProp &&
		!nodeProp.useSchema
	) {
		try {
			// 使用JSX解析器解析包含JSX的字符串
			const result = jsxParser.parse(nodeProp.content || '');
			if (result.success) {
				return result.result;
			} else {
				console.warn('JSX解析失败，返回原始内容:', nodeProp.content);
				// 如果解析失败，返回一个简单的div包装
				return <div>{nodeProp.content}</div>;
			}
		} catch (error) {
			console.warn('ReactNode属性解析失败:', error);
			// 解析失败时返回一个简单的div包装
			return <div>{nodeProp.content}</div>;
		}
	} else if (nodeProp.useSchema && nodeProp.schema && renderComponent) {
		try {
			const result = renderComponent(nodeProp.schema);

			// 确保返回的是有效的 React 元素
			if (result === undefined || result === null) {
				console.warn('Schema 渲染返回了 undefined 或 null，返回默认内容');
				return <div>渲染失败</div>;
			}

			return result;
		} catch (error) {
			console.warn('Schema 渲染失败:', error);
			return (
				<div>
					渲染失败: {error instanceof Error ? error.message : String(error)}
				</div>
			);
		}
	}

	return undefined;
};

// 处理函数组件属性，将FunctionReactNodeProperty转换为React组件函数
const processFunctionReactNodeProperty = (
	funcProp: FunctionReactNodeProperty | undefined,
	jsxParser: JSXParser
): ((props: any) => React.ReactNode) | undefined => {
	if (!funcProp || funcProp.type !== 'functionReactNode') {
		return undefined;
	}

	try {
		console.log('开始解析函数组件:', funcProp.content);
		// 使用JSX解析器解析包含函数组件的字符串
		const result = jsxParser.parse(funcProp.content);
		console.log('函数组件解析结果:', result);
		if (result.success && typeof result.result === 'function') {
			console.log('解析成功，返回函数组件:', result.result);
			return result.result as (props: any) => React.ReactNode;
		} else {
			console.warn('函数组件解析失败，返回默认函数:', funcProp.content);
			// 如果解析失败，返回一个默认的函数组件
			return (props: any) => <div>解析失败: {funcProp.content}</div>;
		}
	} catch (error) {
		console.warn('函数组件属性解析失败:', error);
		// 解析失败时返回一个默认的函数组件
		return (props: any) => <div>解析失败: {funcProp.content}</div>;
	}
};

// 处理组件属性，将配置转换为组件props
const processComponentProps = (
	props: Record<string, any> = {},
	jsxParser: JSXParser,
	renderComponent?: (schema: ComponentSchema, key?: string) => React.ReactNode
): Record<string, any> => {
	const processedProps: Record<string, any> = {};

	Object.entries(props).forEach(([key, value]) => {
		if (value && typeof value === 'object') {
			if (value.type === 'function') {
				// 处理函数属性
				const func = processFunctionProperty(value as FunctionProperty);
				if (func) {
					processedProps[key] = func;
				}
			} else if (value.type === 'functionReactNode') {
				// 处理函数组件属性
				const funcComponent = processFunctionReactNodeProperty(
					value as FunctionReactNodeProperty,
					jsxParser
				);
				if (funcComponent) {
					processedProps[key] = funcComponent;
				}
			} else if (value.type === 'reactNode') {
				// 处理ReactNode属性
				const node = processReactNodeProperty(
					value as ReactNodeProperty,
					jsxParser,
					renderComponent
				);
				if (node !== undefined) {
					processedProps[key] = node;
				}
			} else if (
				value.type &&
				value.type !== 'function' &&
				value.type !== 'functionReactNode' &&
				renderComponent
			) {
				// 处理直接的组件 schema（如 title 属性中的 Input 组件）
				try {
					const node = renderComponent(value as ComponentSchema);
					if (node !== undefined) {
						processedProps[key] = node;
					}
				} catch (error) {
					console.warn('直接组件 schema 处理失败:', error);
					processedProps[key] = (
						<div>
							渲染失败: {error instanceof Error ? error.message : String(error)}
						</div>
					);
				}
			} else if (key === 'rows' && Array.isArray(value)) {
				// 特殊处理DynamicForm的rows配置
				processedProps[key] = value.map((row: any) => ({
					...row,
					fields: Array.isArray(row.fields)
						? row.fields.map((field: any) => {
								if (field && typeof field === 'object' && 'type' in field) {
									// 处理 ReactNodeProperty 类型（包括 ComponentSchema）
									if (
										field.type === 'reactNode' ||
										(field.type && field.type !== 'reactNode')
									) {
										const parsedField = processReactNodeProperty(
											field as ReactNodeProperty,
											jsxParser,
											renderComponent
										);
										console.log(
											'解析后的字段:',
											parsedField,
											'类型:',
											typeof parsedField
										);
										return parsedField;
									}
								}
								return field;
						  })
						: row.fields,
				}));
			} else {
				// 其他对象属性直接传递
				processedProps[key] = value;
			}
		} else {
			// 基本类型直接传递
			processedProps[key] = value;
		}
	});

	return processedProps;
};

// 处理FormItem属性
const processFormItemProps = (
	formItemSchema: any,
	jsxParser: JSXParser,
	renderComponent?: (schema: ComponentSchema, key?: string) => React.ReactNode
): Record<string, any> => {
	if (!formItemSchema || !formItemSchema.properties) {
		return {};
	}

	const { properties } = formItemSchema;
	const processedProps: Record<string, any> = {};

	// 处理基本属性
	Object.entries(properties).forEach(([key, value]) => {
		if (key === 'onChange' || key === 'onBlur' || key === 'onFocus') {
			// 处理事件函数
			const func = processFunctionProperty(value as FunctionProperty);
			if (func) {
				processedProps[key] = func;
			}
		} else if (key === 'extra' || key === 'tips') {
			// 处理ReactNode属性
			const node = processReactNodeProperty(
				value as ReactNodeProperty,
				jsxParser,
				renderComponent
			);
			if (node !== undefined) {
				processedProps[key] = node;
			}
		} else {
			// 其他属性直接传递
			processedProps[key] = value;
		}
	});

	return processedProps;
};

export class SchemaEngine {
	private handlers: Record<string, SubmitHandler | ValuesChangeHandler>;
	private jsxParser: JSXParser;
	private queueManager?: ComponentQueueManager;

	constructor(
		customHandlers?: Record<string, SubmitHandler | ValuesChangeHandler>,
		jsxParser?: JSXParser,
		queueConfig?: {
			maxConcurrent?: number;
			batchSize?: number;
			delay?: number;
			priorityLevels?: number;
		}
	) {
		this.handlers = { ...DEFAULT_HANDLERS, ...customHandlers };
		this.jsxParser = jsxParser || new JSXParser();

		// 初始化队列管理器
		if (queueConfig) {
			this.queueManager = new ComponentQueueManager(
				this.renderComponent.bind(this),
				queueConfig
			);
		}
	}

	// 渲染单个组件
	private renderComponent(
		schema: ComponentSchema,
		key?: string
	): React.ReactNode {
		const Component = DEFAULT_COMPONENT_MAP[schema.type];

		if (!Component) {
			console.warn(`Unknown component type: ${schema.type}`);
			return <div key={key}>Unknown component: {schema.type}</div>;
		}

		// 处理组件属性
		const componentProps = processComponentProps(
			schema.properties,
			this.jsxParser,
			this.renderComponent.bind(this)
		);

		// 处理子组件
		const childrenNodes = schema.children?.map((child, index) =>
			this.renderComponent(child, `${key || 'root'}-${index}`)
		);

		// 如果有formItem配置，用FormItem包裹
		if (schema.formItem) {
			const formItemProps = processFormItemProps(
				schema.formItem,
				this.jsxParser,
				this.renderComponent.bind(this)
			);

			return (
				<FormItem
					key={key}
					id={schema.formItem.properties?.id || `form-item-${key}`}
					{...formItemProps}
				>
					{childrenNodes && childrenNodes.length > 0
						? React.createElement(
								Component,
								{ ...componentProps },
								childrenNodes
						  )
						: React.createElement(Component, { ...componentProps })}
				</FormItem>
			);
		}

		// 直接渲染组件
		return childrenNodes && childrenNodes.length > 0
			? React.createElement(
					Component,
					{ key, ...componentProps },
					childrenNodes
			  )
			: React.createElement(Component, { key, ...componentProps });
	}

	// 使用队列渲染组件
	private async renderComponentWithQueue(
		schema: ComponentSchema,
		key?: string,
		priority: number = 0
	): Promise<React.ReactNode> {
		if (!this.queueManager) {
			// 如果没有队列管理器，直接渲染
			return this.renderComponent(schema, key);
		}

		return this.queueManager.addToQueue(schema, key, priority);
	}

	// 渲染表单
	public renderForm(schema: FormSchema): React.ReactNode {
		const { properties } = schema;
		const { initialValues, mode, onSubmit, onValuesChange, children } =
			properties;

		// 获取事件处理函数
		const submitHandler = onSubmit?.content
			? (values: Record<string, FieldValue>, store: FormStore) => {
					try {
						const func = new Function('values', 'store', onSubmit.content);
						return func(values, store);
					} catch (error) {
						console.warn('提交函数执行失败:', error);
					}
			  }
			: undefined;

		const valuesChangeHandler = onValuesChange?.content
			? (
					changedValues: Record<string, FieldValue>,
					allValues: Record<string, FieldValue>
			  ) => {
					try {
						const func = new Function(
							'changedValues',
							'allValues',
							onValuesChange.content
						);
						return func(changedValues, allValues);
					} catch (error) {
						console.warn('值变化函数执行失败:', error);
					}
			  }
			: undefined;

		// 如果有队列管理器，使用异步渲染
		if (this.queueManager) {
			return this.renderFormWithQueue(
				schema,
				submitHandler,
				valuesChangeHandler
			);
		}

		// 直接渲染
		return (
			<Form
				initialValues={initialValues || {}}
				mode={mode}
				onSubmit={submitHandler}
				onValuesChange={valuesChangeHandler}
			>
				{children.map((child, index) =>
					this.renderComponent(child, `form-child-${index}`)
				)}
			</Form>
		);
	}

	// 使用队列渲染表单
	private renderFormWithQueue(
		schema: FormSchema,
		submitHandler?: SubmitHandler,
		valuesChangeHandler?: ValuesChangeHandler
	): React.ReactNode {
		const { properties } = schema;
		const { initialValues, mode, children } = properties;

		return (
			<Form
				initialValues={initialValues || {}}
				mode={mode}
				onSubmit={submitHandler}
				onValuesChange={valuesChangeHandler}
			>
				<QueuedFormRenderer
					children={children}
					renderComponent={this.renderComponentWithQueue.bind(this)}
					queueManager={this.queueManager!}
				/>
			</Form>
		);
	}

	// 静态方法，用于快速渲染
	static render(
		schema: FormSchema,
		customHandlers?: Record<string, SubmitHandler | ValuesChangeHandler>,
		jsxParser?: JSXParser,
		queueConfig?: {
			maxConcurrent?: number;
			batchSize?: number;
			delay?: number;
			priorityLevels?: number;
		}
	): React.ReactNode {
		const engine = new SchemaEngine(customHandlers, jsxParser, queueConfig);
		console.log('sch123213123ema', schema);
		return engine.renderForm(schema);
	}

	// 获取队列状态
	public getQueueStatus() {
		return this.queueManager?.getStatus();
	}

	// 清空队列
	public clearQueue() {
		this.queueManager?.clearQueue();
	}

	// 更新队列配置
	public updateQueueConfig(config: {
		maxConcurrent?: number;
		batchSize?: number;
		delay?: number;
		priorityLevels?: number;
	}) {
		this.queueManager?.updateConfig(config);
	}
}

// 队列渲染器组件
interface QueuedFormRendererProps {
	children: ComponentSchema[];
	renderComponent: (
		schema: ComponentSchema,
		key?: string,
		priority?: number
	) => Promise<React.ReactNode>;
	queueManager: ComponentQueueManager;
}

const QueuedFormRenderer: React.FC<QueuedFormRendererProps> = ({
	children,
	renderComponent,
	queueManager,
}) => {
	const [renderedComponents, setRenderedComponents] = React.useState<
		React.ReactNode[]
	>([]);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		let isMounted = true;

		const renderComponents = async () => {
			const components: React.ReactNode[] = [];

			// 先渲染所有组件为加载状态
			const loadingComponents = children.map((_, index) => (
				<div
					key={`loading-${index}`}
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
			));

			setRenderedComponents(loadingComponents);

			// 逐个渲染组件
			for (let i = 0; i < children.length; i++) {
				if (!isMounted) break;

				try {
					const component = await renderComponent(
						children[i],
						`form-child-${i}`,
						i
					);

					if (isMounted) {
						setRenderedComponents((prev) => {
							const newComponents = [...prev];
							newComponents[i] = component;
							return newComponents;
						});
					}
				} catch (error) {
					console.warn(`组件 ${i} 渲染失败:`, error);
					if (isMounted) {
						setRenderedComponents((prev) => {
							const newComponents = [...prev];
							newComponents[i] = (
								<div key={`error-${i}`} style={{ color: 'red' }}>
									渲染失败
								</div>
							);
							return newComponents;
						});
					}
				}
			}

			if (isMounted) {
				setIsLoading(false);
			}
		};

		renderComponents();

		return () => {
			isMounted = false;
		};
	}, [children, renderComponent]);

	return <>{renderedComponents}</>;
};

export default SchemaEngine;
