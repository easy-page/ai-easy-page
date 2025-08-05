import { FieldValue, FormMode } from '@easy-page/core';
import { ComponentSchema } from './component';
import { FormContextRequestConfigSchema } from './request';
import { FunctionProperty, ReactNodeProperty } from './specialProperties';

export interface StoreSchema {
	type: 'store';
	properties: {
		initialValues?: Record<string, FieldValue>;
		maxConcurrentRequests?: number;
		mode?: FormMode;
	};
}

// Schema 类型定义
export interface FormSchema {
	type: 'form';
	properties: {
		initialValues?: Record<string, FieldValue>;
		mode?: FormMode;
		onSubmit?: FunctionProperty; // 函数名称
		onValuesChange?: FunctionProperty; // 函数名称
		children: ComponentSchema[];
		loadingComponent?: ReactNodeProperty;
		store?: StoreSchema;
		initReqs?: Record<string, FormContextRequestConfigSchema>; // 初始化请求配置
	};
}

// 空表单的默认 Schema
export const EMPTY_FORM_SCHEMA: FormSchema = {
	type: 'form',
	properties: {
		initialValues: {},
		onSubmit: { type: 'function', content: '' },
		onValuesChange: { type: 'function', content: '' },
		children: [
			{
				type: 'EmptyNode',
				props: {},
			},
		],
	},
};
