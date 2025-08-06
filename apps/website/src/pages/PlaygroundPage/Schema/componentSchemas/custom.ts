import { CommonComponentProps, baseProps } from './types';

// Custom 组件属性 Schema
export interface CustomPropsSchema {
	type: 'custom';
	properties: CommonComponentProps & {
		componentName?: string;
		componentId?: string;
		description?: string;
		content?: string;
	};
}

// Custom 默认属性
export const getDefaultCustomProps = (): CustomPropsSchema => ({
	type: 'custom',
	properties: {
		...baseProps,
		componentName: '自定义组件',
		componentId: 'custom-component',
		description: '这是一个自定义组件',
		content: '// 在这里编写自定义组件代码\nreturn <div>自定义组件</div>;',
	},
});
