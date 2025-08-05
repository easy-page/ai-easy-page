import { FieldValue, FormMode } from '@easy-page/core';

// Schema 类型定义
export interface FormSchema {
	type: 'form';
	properties: {
		initialValues?: Record<string, FieldValue>;
		mode?: FormMode;
		onSubmit?: string; // 函数名称
		onValuesChange?: string; // 函数名称
		children: ComponentSchema[];
	};
}

export interface ComponentSchema {
	type: string;
	props?: Record<string, FieldValue>;
	children?: ComponentSchema[];
}

// 空表单的默认 Schema
export const EMPTY_FORM_SCHEMA: FormSchema = {
	type: 'form',
	properties: {
		initialValues: {},
		onSubmit: 'handleSubmit',
		onValuesChange: 'handleValuesChange',
		children: [
			{
				type: 'EmptyNode',
				props: {},
			},
		],
	},
};

// 预定义的 Schema 模板
export const SCHEMA_TEMPLATES = {
	EMPTY_FORM: EMPTY_FORM_SCHEMA,
};
