// 重新导出所有 Schema 类型
export * from './form';
export * from './formItem';
export * from './validation';
export * from './effects';
export * from './request';
export * from './component';

// 预定义的 Schema 模板
import { EMPTY_FORM_SCHEMA } from './form';

export const SCHEMA_TEMPLATES = {
	EMPTY_FORM: EMPTY_FORM_SCHEMA,
};
