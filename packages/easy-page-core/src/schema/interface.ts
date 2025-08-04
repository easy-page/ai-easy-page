export interface EasyPageSchema {
	// 当前节点使用的组件
	componentName: string;
	componentProps: Record<string, any>;
	children: EasyPageSchema[];
}
