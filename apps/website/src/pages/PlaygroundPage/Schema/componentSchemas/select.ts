import { ComponentSchema } from '../component';
import { FunctionProperty } from '../specialProperties';
import { CommonComponentProps, OptionItem, baseProps } from './types';

// Select 组件属性 Schema
export interface SelectPropsSchema extends ComponentSchema {
	type: 'select';
	properties: CommonComponentProps & {
		options?: OptionItem[];
		mode?: 'multiple' | 'tags';
		allowClear?: boolean;
		showSearch?: boolean;
		remoteSearch?: boolean;
		onSearch?: FunctionProperty;
	};
}

// Select 默认属性
export const getDefaultSelectProps = (): SelectPropsSchema => ({
	type: 'select',
	properties: {
		...baseProps,
		options: [
			{ label: '选项1', value: 'option1' },
			{ label: '选项2', value: 'option2' },
			{ label: '选项3', value: 'option3' },
		],
		allowClear: true,
		showSearch: false,
	},
});
