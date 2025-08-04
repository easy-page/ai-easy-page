import { FieldValue, FormMode } from '../types';
import { FunctionSchema } from './context/interface';

// 主要的 Schema 接口
export interface FormSchema {
	// 要注册的组件的组件名，后面基于远程 JS 挂载 window 进行注册
	componentNames: string[];
	page: PageSchema;
}

export interface BaseSchema<Props = any> {
	componentName: string; // 指定组件名，字段渲染的组件
	componentProps: Props; // 组件的属性
}

export type FormContextRequestConfigSchema = {
	mode?: FormMode[]; // 在哪些模式下执行请求
	depends?: string[];
	req: FunctionProperty;
};

// 告诉渲染引擎是函数，用函数执行
export type FunctionProperty = {
	type: 'function';
	content: string;
};

// 告诉引擎是一个 reactNode 节点，用节点渲染
export type ReactNodeProperty = {
	type: 'reactNode';
	content: string;
};

// 容器本身 - Form 组件
export interface PageSchema
	extends BaseSchema<{
		initialValues?: Record<string, FieldValue>;
		mode?: FormMode;
		initReqs?: Record<string, FormContextRequestConfigSchema>;
		onSubmit?: FunctionProperty;
	}> {}

export interface FieldSchema {
	children: FieldSchema[];
}

export const OnSubmitSchema: FunctionSchema = {
	type: 'function',
	name: 'onSubmit',
	desc: '用于表单提交',
	params: ['values', 'store'],
	returnResultType: ['void'],
	isPromise: true,
};

export const FormDemoSchema: FormSchema = {
	componentNames: ['Form'],
	page: {
		componentName: 'Form',
		componentProps: {
			initialValues: {},
			mode: FormMode.CREATE,
			onSubmit: '',
			initReqs: {
				detail: {
					mode: [FormMode.EDIT, FormMode.VIEW],
					req: '',
				},
			},
		},
	},
};
