import * as React from 'react';
import { EASY_PAGE_EXTENDED_COMPONENT_MAP } from '../utils/componentMaps';

// Easy-Page 组件映射表
export const EASY_PAGE_COMPONENT_MAP: Record<
	string,
	React.ComponentType<any>
> = EASY_PAGE_EXTENDED_COMPONENT_MAP;

// 重新导出工具函数
export const getEasyPageComponentNames = (): string[] => {
	return Object.keys(EASY_PAGE_COMPONENT_MAP);
};

// 检查组件是否存在
export const hasEasyPageComponent = (name: string): boolean => {
	return name in EASY_PAGE_COMPONENT_MAP;
};

// 获取组件
export const getEasyPageComponent = (
	name: string
): React.ComponentType<any> | undefined => {
	return EASY_PAGE_COMPONENT_MAP[name];
};
