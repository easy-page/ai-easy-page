// 用于定义要生成的数据的类型
export type GenerateReactNodeType = {
	name: string;
	desc: string;
	type: 'reactNode';
	content: string; // 原始定义，如：`ReactNode | (() => ReactNode)`
	optional?: boolean; // 是否可选
};
