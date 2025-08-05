import { FormMode } from '@easy-page/core';
import { FunctionProperty } from './specialProperties';

// 表单上下文请求配置 Schema
export interface FormContextRequestConfigSchema {
	req: FunctionProperty;
	mode?: FormMode[];
	depends?: string[];
}

// 字段请求配置 Schema
export interface FieldRequestConfigSchema {
	effectedBy?: string[];
	handler: FunctionProperty; // 函数名称
	searchedById?: FunctionProperty; // 函数名称
}
