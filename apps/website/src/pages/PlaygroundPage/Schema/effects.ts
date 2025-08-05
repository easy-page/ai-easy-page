import { FunctionProperty } from './specialProperties';

// 副作用配置 Schema
export interface EffectConfigSchema {
	effectedKeys?: string[];
	handler?: FunctionProperty; // 函数名称
}

// 动作配置 Schema
export interface ActionConfigSchema {
	effectedBy: string[];
	handler: FunctionProperty; // 函数名称
}
