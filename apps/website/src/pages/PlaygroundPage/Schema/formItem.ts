import { FieldValue } from '@easy-page/core';
import { ComponentSchema } from './component';
import { ValidationRuleSchema, ValidateEffectSchema } from './validation';
import { EffectConfigSchema, ActionConfigSchema } from './effects';
import { FieldRequestConfigSchema } from './request';

// FormItem Schema
export interface FormItemSchema {
	type: 'formItem';
	properties: {
		id: string;
		label?: string;
		required?: boolean;
		validate?: ValidationRuleSchema[];
		validateEffects?: ValidateEffectSchema[];
		effects?: EffectConfigSchema[];
		actions?: ActionConfigSchema[];
		req?: FieldRequestConfigSchema;
		extra?: string; // 函数名称或 ReactNode
		tips?: string; // ReactNode 转换为字符串
		help?: string;
		labelLayout?: 'horizontal' | 'vertical';
		labelWidth?: number | string;
		noLabel?: boolean;
	};
}
