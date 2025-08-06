import { FunctionProperty, ReactNodeProperty } from '../specialProperties';
import { CommonComponentProps, baseProps } from './types';

// Container 组件属性 Schema
export interface ContainerPropsSchema {
	type: 'container';
	properties: CommonComponentProps & {
		title?: ReactNodeProperty;
		titleType?: 'h1' | 'h2' | 'h3' | 'h4';
		layout?: 'horizontal' | 'vertical';
		containerType?: 'Card' | 'Bordered';
		customContainer?: FunctionProperty;
		collapsible?: boolean;
		defaultCollapsed?: boolean;
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
	},
});
