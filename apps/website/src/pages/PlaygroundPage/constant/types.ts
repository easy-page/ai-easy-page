import * as React from 'react';

// 组件映射表类型
export interface ComponentMap {
	[key: string]: React.ComponentType<any>;
}

// 解析器选项
export interface ParserOptions {
	componentMap?: ComponentMap;
	enableDebug?: boolean;
	strictMode?: boolean;
}

// 解析结果类型
export interface ParseResult {
	success: boolean;
	result: React.ReactNode;
	error?: string;
}

// 组件注册信息
export interface ComponentRegistration {
	name: string;
	component: React.ComponentType<any>;
	description?: string;
	category?: string;
}
