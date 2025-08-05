import { FieldValue } from '@easy-page/core';
import { FormItemSchema } from './formItem';

export interface ComponentSchema {
	type: string;
	props?: Record<string, FieldValue>;
	formItem?: FormItemSchema;
	children?: ComponentSchema[];
}
