import { FunctionProperty } from '../specialProperties';
import { CommonComponentProps, OptionItem, baseProps } from './types';

// Select 组件属性 Schema
export interface SelectPropsSchema {
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
		options: [],
		allowClear: true,
		showSearch: false,
	},
});
