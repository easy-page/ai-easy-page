import { CommonComponentProps, baseProps } from './types';

// TextArea 组件属性 Schema
export interface TextAreaPropsSchema {
	type: 'textArea';
	properties: CommonComponentProps & {
		rows?: number;
		maxLength?: number;
		showCount?: boolean;
		autoSize?: boolean | { minRows?: number; maxRows?: number };
	};
}

// TextArea 默认属性
export const getDefaultTextAreaProps = (): TextAreaPropsSchema => ({
	type: 'textArea',
	properties: {
		...baseProps,
		rows: 4,
		showCount: false,
	},
});
