import { FieldValue, FormMode } from '../types';
import {
	PropertySchema,
	EnumSchema,
	ReactNodeSchema,
	FunctionSchema,
} from './context/interface';

export type FormContextRequestConfigSchema = {
	mode?: FormMode[]; // 在哪些模式下执行请求
	depends?: string[];
	req: FunctionSchema;
};

export type FormSchema = {
	initialValues?: Record<string, FieldValue>;
	mode?: FormMode;
	initReqs?: Record<string, FormContextRequestConfigSchema>; // 初始化请求配置
	onSubmit?: {
		type: 'function';
		content: string;
	};
};
