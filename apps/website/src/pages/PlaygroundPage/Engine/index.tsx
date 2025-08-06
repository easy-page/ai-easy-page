import React from 'react';
import { Form, FormStore, FieldValue, FormItem, When } from '@easy-page/core';
import {
	Input,
	Select,
	Checkbox,
	CheckboxGroup,
	Radio,
	RadioGroup,
	TextArea,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,
	DynamicForm,
} from '@easy-page/pc';
import { FormSchema, ComponentSchema } from '../Schema';
import {
	FunctionProperty,
	ReactNodeProperty,
} from '../Schema/specialProperties';
import { JSXParser, ComponentMapper } from '../JSXParser';
import {
	ComponentQueueManager,
	useComponentQueue,
} from './ComponentQueueManager';
import { createFunctionFromString } from './functionParser';

// 组件映射表
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
	// Core components
	When,
	FormItem,
	DynamicForm,

	// PC components
	Input,
	Select,
	Checkbox,
	CheckboxGroup,
	Radio,
	RadioGroup,
	TextArea,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,

	// Placeholder
	EmptyNode: () => <div style={{ color: 'white' }}>暂无内容</div>,
};

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
	jsxParser: JSXParser
): React.ReactNode => {
	if (!nodeProp || nodeProp.type !== 'reactNode') {
		return undefined;
	}

	try {
		// 使用JSX解析器解析包含JSX的字符串
		const result = jsxParser.parse(nodeProp.content);
		return result.success ? result.result : nodeProp.content;
	} catch (error) {
		console.warn('ReactNode属性解析失败:', error);
		return nodeProp.content; // 解析失败时返回原始内容
	}
};

// 处理组件属性，将配置转换为组件props
const processComponentProps = (
	props: Record<string, any> = {},
	jsxParser: JSXParser
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
			} else if (value.type === 'reactNode') {
				// 处理ReactNode属性
				const node = processReactNodeProperty(
					value as ReactNodeProperty,
					jsxParser
				);
				if (node !== undefined) {
					processedProps[key] = node;
				}
			} else if (key === 'rows' && Array.isArray(value)) {
				// 特殊处理DynamicForm的rows配置
				processedProps[key] = value.map((row: any) => ({
					...row,
					fields: Array.isArray(row.fields)
						? row.fields.map((field: any) => {
								if (
									field &&
									typeof field === 'object' &&
									field.type === 'reactNode'
								) {
									return processReactNodeProperty(
										field as ReactNodeProperty,
										jsxParser
									);
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
	jsxParser: JSXParser
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
				jsxParser
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
		const Component = COMPONENT_MAP[schema.type];

		if (!Component) {
			console.warn(`Unknown component type: ${schema.type}`);
			return <div key={key}>Unknown component: {schema.type}</div>;
		}

		// 处理组件属性
		const componentProps = processComponentProps(schema.props, this.jsxParser);

		// 处理子组件
		const children = schema.children?.map((child, index) =>
			this.renderComponent(child, `${key || 'root'}-${index}`)
		);

		// 如果有formItem配置，用FormItem包裹
		if (schema.formItem) {
			const formItemProps = processFormItemProps(
				schema.formItem,
				this.jsxParser
			);

			return (
				<FormItem
					key={key}
					id={schema.formItem.properties?.id || `form-item-${key}`}
					{...formItemProps}
				>
					{React.createElement(Component, { ...componentProps }, children)}
				</FormItem>
			);
		}

		// 直接渲染组件
		return React.createElement(Component, { key, ...componentProps }, children);
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
