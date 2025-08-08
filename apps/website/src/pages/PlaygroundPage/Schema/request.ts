import { FormMode } from '@easy-page/core';
import { FunctionProperty } from './specialProperties';

// 表单上下文请求配置 Schema
export interface FormContextRequestConfigSchema {
	/** 请求函数 */
	req: FunctionProperty;
	/** 请求模式，表示在什么模式下会触发请求 */
	mode?: FormMode[];
	/** 依赖字段，表明某些字段发生变化后，会触发重新请求，字段和 initValues 中的字段 Key 一致 */
	depends?: string[];
}

// 字段请求配置 Schema
export interface FieldRequestConfigSchema {
	/** 依赖字段，表明某些字段发生变化后，会触发重新请求，字段和 initValues 中的字段 Key 一致 */
	effectedBy?: string[];
	/** 请求函数 */
	handler: FunctionProperty;
	/** 搜索函数 */
	searchedById?: FunctionProperty;
}
