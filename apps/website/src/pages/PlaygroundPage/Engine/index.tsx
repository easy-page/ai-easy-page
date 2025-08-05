import React from 'react';
import { Form, FormStore, FieldValue } from '@easy-page/core';
import { FormSchema, ComponentSchema } from '../Schema';

// 组件映射表
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
	EmptyNode: () => <div>暂无内容</div>,
	// 可以在这里扩展更多组件
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

export class SchemaEngine {
	private handlers: Record<string, SubmitHandler | ValuesChangeHandler>;

	constructor(
		customHandlers?: Record<string, SubmitHandler | ValuesChangeHandler>
	) {
		this.handlers = { ...DEFAULT_HANDLERS, ...customHandlers };
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

		const props = schema.props || {};
		const children = schema.children?.map((child, index) =>
			this.renderComponent(child, `${key || 'root'}-${index}`)
		);

		return React.createElement(Component, { key, ...props }, children);
	}

	// 渲染表单
	public renderForm(schema: FormSchema): React.ReactNode {
		const { properties } = schema;
		const { initialValues, mode, onSubmit, onValuesChange, children } =
			properties;

		// 获取事件处理函数
		const submitHandler = onSubmit
			? (this.handlers[onSubmit] as SubmitHandler)
			: undefined;
		const valuesChangeHandler = onValuesChange
			? (this.handlers[onValuesChange] as ValuesChangeHandler)
			: undefined;

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

	// 静态方法，用于快速渲染
	static render(
		schema: FormSchema,
		customHandlers?: Record<string, SubmitHandler | ValuesChangeHandler>
	): React.ReactNode {
		const engine = new SchemaEngine(customHandlers);
		return engine.renderForm(schema);
	}
}

export default SchemaEngine;
