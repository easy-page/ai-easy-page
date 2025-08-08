import { FieldValue, FormMode } from '@easy-page/core';
import { ComponentSchema } from './component';
import { FormContextRequestConfigSchema } from './request';
import { FunctionProperty, ReactNodeProperty } from './specialProperties';

export interface StoreSchema {
	type: 'store';
	properties: {
		maxConcurrentRequests?: number;
	};
}

// Schema 类型定义
export interface FormSchema {
	type: 'form';
	properties: {
		/** 表单初始值 */
		initialValues?: Record<string, FieldValue>;
		/** 表单模式 */
		mode?: FormMode;
		/** 表单提交函数 */
		onSubmit?: FunctionProperty;
		/** 表单值变化函数 */
		onValuesChange?: FunctionProperty;
		/** 表单字段组件 */
		children: ComponentSchema[];
		/** 表单加载组件 */
		loadingComponent?: ReactNodeProperty;
		/** 表单存储 */
		store?: StoreSchema;
		/** 表单初始化请求配置 */
		initReqs?: Record<string, FormContextRequestConfigSchema>;
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
