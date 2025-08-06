import { CommonComponentProps, OptionItem, baseProps } from './types';

// Checkbox 组件属性 Schema
export interface CheckboxPropsSchema {
	type: 'checkbox';
	properties: CommonComponentProps & {
		indeterminate?: boolean;
		label?: string;
	};
}

// CheckboxGroup 组件属性 Schema
export interface CheckboxGroupPropsSchema {
	type: 'checkboxGroup';
	properties: CommonComponentProps & {
		options?: OptionItem[];
	};
}

// Checkbox 默认属性
export const getDefaultCheckboxProps = (): CheckboxPropsSchema => ({
	type: 'checkbox',
	properties: {
		...baseProps,
		label: '复选框',
	},
});

// CheckboxGroup 默认属性
export const getDefaultCheckboxGroupProps = (): CheckboxGroupPropsSchema => ({
	type: 'checkboxGroup',
	properties: {
		...baseProps,
		options: [
			{ label: '选项1', value: 'option1' },
			{ label: '选项2', value: 'option2' },
			{ label: '选项3', value: 'option3' },
		],
	},
});
