// 副作用配置 Schema
export interface EffectConfigSchema {
	effectedKeys?: string[];
	handler?: string; // 函数名称
}

// 动作配置 Schema
export interface ActionConfigSchema {
	effectedBy: string[];
	handler: string; // 函数名称
}
