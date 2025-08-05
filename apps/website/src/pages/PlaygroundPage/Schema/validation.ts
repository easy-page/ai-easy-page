// 验证规则 Schema
export interface ValidationRuleSchema {
	required?: boolean;
	message?: string;
	pattern?: string; // RegExp 转换为字符串
	min?: number;
	max?: number;
	len?: number;
	validator?: string; // 函数名称
	transform?: string; // 函数名称
	dependentFields?: string[];
	affectFields?: string[];
}

// 验证影响配置 Schema
export interface ValidateEffectSchema {
	affectFields: string[];
	effectNextRow?: boolean;
	effectPreviousRow?: boolean;
	message?: string;
}
