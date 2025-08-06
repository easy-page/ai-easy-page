import {
	ComponentTypeOption,
	ComponentTypeOptionsWithCategory,
} from './data/componentOptions';
import { ComponentCategory } from './types';

// 按分类获取组件选项
export const getComponentOptionsByCategory = (
	category: ComponentCategory
): ComponentTypeOption[] => {
	return ComponentTypeOptionsWithCategory.filter(
		(option) => option.category === category
	);
};

// 获取所有分类
export const getAllCategories = (): ComponentCategory[] => {
	return Object.values(ComponentCategory);
};

// 搜索组件选项
export const searchComponentOptions = (
	keyword: string
): ComponentTypeOption[] => {
	const lowerKeyword = keyword.toLowerCase();
	return ComponentTypeOptionsWithCategory.filter(
		(option) =>
			option.label.toLowerCase().includes(lowerKeyword) ||
			option.description.toLowerCase().includes(lowerKeyword) ||
			option.category.toLowerCase().includes(lowerKeyword)
	);
};
