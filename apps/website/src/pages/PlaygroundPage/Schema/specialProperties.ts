import { ComponentSchema } from './component';

export type FunctionProperty = {
	type: 'function';
	content: string; // 函数内容
};

export type ReactNodeProperty = {
	type: 'reactNode';
	content?: string; // 节点内容
	useSchema?: boolean;
	schema?: ComponentSchema;
};

/**
 * - 函数组件，即返回的结果是一个组件的类型
 */
export type FunctionReactNodeProperty = {
	type: 'functionReactNode';
	content: string; // 节点内容
};
