// 用于定义要生成的数据的类型
export type GenerateReactNodeType = {
	name: string;
	desc: string;
	type: 'reactNode';
	content: string; // 原始定义，如：`ReactNode | (() => ReactNode)`
};


生成的产物是： Schema 常量
描述生成的是：Schema 
描述 AI 生成的是 GenerateXXX 相关的类型定义
让 AI 生成的是。GenerateXXX 的常量，来描述要生成怎样的组件和函数
需要 AI 生成属性的查找路径是：组件名.属性