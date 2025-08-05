import { FieldValue } from '@easy-page/core';
import { ComponentSchema } from './component';
import { ValidationRuleSchema, ValidateEffectSchema } from './validation';
import { EffectConfigSchema, ActionConfigSchema } from './effects';
import { FieldRequestConfigSchema } from './request';
import { FunctionProperty, ReactNodeProperty } from './specialProperties';

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
		extra?: ReactNodeProperty; // 函数名称或 ReactNode
		tips?: ReactNodeProperty; // ReactNode 转换为字符串
		help?: string;
		labelLayout?: 'horizontal' | 'vertical';
		labelWidth?: number | string;
		noLabel?: boolean;
		disabled?: boolean;
		hidden?: boolean;
		onChange?: FunctionProperty;
		onBlur?: FunctionProperty;
		onFocus?: FunctionProperty;
	};
}

// 导出 FormItemProps 类型用于配置面板
export interface FormItemProps {
	id: string;
	label?: string;
	required?: boolean;
	validate?: ValidationRuleSchema[];
	validateEffects?: ValidateEffectSchema[];
	effects?: EffectConfigSchema[];
	actions?: ActionConfigSchema[];
	req?: FieldRequestConfigSchema;
	extra?: ReactNodeProperty;
	tips?: ReactNodeProperty;
	help?: string;
	labelLayout?: 'horizontal' | 'vertical';
	labelWidth?: number | string;
	noLabel?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	onChange?: FunctionProperty;
	onBlur?: FunctionProperty;
	onFocus?: FunctionProperty;
}
