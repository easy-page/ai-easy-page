import { ComponentSchema } from '../component';
import { CommonComponentProps, baseProps } from './types';

// Input 组件属性 Schema
export interface InputPropsSchema extends ComponentSchema {
	type: 'input';
	properties: CommonComponentProps & {
		type?: 'text' | 'password' | 'number' | 'email' | 'url';
		maxLength?: number;
		showCount?: boolean;
		allowClear?: boolean;
		prefix?: string;
		suffix?: string;
	};
}

// Input 默认属性
export const getDefaultInputProps = (): InputPropsSchema => ({
	type: 'input',
	properties: {
		...baseProps,
		type: 'text',
		allowClear: true,
	},
});
