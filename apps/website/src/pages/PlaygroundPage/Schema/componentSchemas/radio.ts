import { CommonComponentProps, OptionItem, baseProps } from './types';

// Radio 组件属性 Schema
export interface RadioPropsSchema {
	type: 'radio';
	properties: CommonComponentProps & {
		label?: string;
		value?: string | number;
	};
}

// RadioGroup 组件属性 Schema
export interface RadioGroupPropsSchema {
	type: 'radioGroup';
	properties: CommonComponentProps & {
		options?: OptionItem[];
		optionType?: 'default' | 'button';
	};
}

// Radio 默认属性
export const getDefaultRadioProps = (): RadioPropsSchema => ({
	type: 'radio',
	properties: {
		...baseProps,
		label: '单选框',
		value: 'radio-value',
	},
});

// RadioGroup 默认属性
export const getDefaultRadioGroupProps = (): RadioGroupPropsSchema => ({
	type: 'radioGroup',
	properties: {
		...baseProps,
		options: [],
	},
});
