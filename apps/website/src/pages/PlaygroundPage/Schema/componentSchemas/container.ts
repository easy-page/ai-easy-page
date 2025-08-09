import { ComponentSchema } from '../component';
import {
	FunctionProperty,
	ReactNodeProperty,
	FunctionReactNodeProperty,
} from '../specialProperties';
import { CommonComponentProps, baseProps } from './types';

// Container 组件属性 Schema
export interface ContainerPropsSchema extends ComponentSchema {
	type: 'container';
	properties: CommonComponentProps & {
		title?: ReactNodeProperty;
		titleType?: 'h1' | 'h2' | 'h3' | 'h4';
		layout?: 'horizontal' | 'vertical';
		containerType?: 'Card' | 'Bordered';
		customContainer?: FunctionReactNodeProperty;
		collapsible?: boolean;
		defaultCollapsed?: boolean;
		// WhenProps 相关属性
		effectedBy?: string[];
		show?: FunctionProperty;
	};
}

// Container 默认属性
export const getDefaultContainerProps = (): ContainerPropsSchema => ({
	type: 'container',
	properties: {
		...baseProps,
		title: {
			type: 'reactNode',
			content: '容器',
		},
		titleType: 'h2',
		layout: 'vertical',
		containerType: 'Card',
		collapsible: false,
		defaultCollapsed: false,
		// WhenProps 默认值
		effectedBy: [],
		show: {
			type: 'function',
			content: 'return true;',
		},
	},
});
