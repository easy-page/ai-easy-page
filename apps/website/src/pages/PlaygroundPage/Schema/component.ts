import { FieldValue } from '@easy-page/core';
import { FormItemSchema } from './formItem';

export interface ComponentSchema {
	type: string;
	properties?: Record<string, FieldValue>;
	formItem?: FormItemSchema;
	children?: ComponentSchema[];
	/** 显式声明该组件是否可添加子节点（优先级最高，便于覆盖默认推断） */
	canHaveChildren?: boolean;
}
