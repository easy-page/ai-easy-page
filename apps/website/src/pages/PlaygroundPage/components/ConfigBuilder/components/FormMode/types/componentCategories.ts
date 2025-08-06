import { ComponentType } from './componentTypes';

// 组件分类枚举
export enum ComponentCategory {
	FORM_INPUT = 'form-input',
	FORM_SELECT = 'form-select',
	FORM_DATE = 'form-date',
	FORM_LAYOUT = 'form-layout',
	DISPLAY = 'display',
	FEEDBACK = 'feedback',
	NAVIGATION = 'navigation',
	DATA_ENTRY = 'data-entry',
}

// 组件分类配置
export interface ComponentCategoryConfig {
	id: ComponentCategory;
	name: string;
	description: string;
	icon?: string;
}

// 组件分类配置映射
export const COMPONENT_CATEGORIES: ComponentCategoryConfig[] = [
	{
		id: ComponentCategory.FORM_INPUT,
		name: '表单输入',
		description: '基础输入组件',
		icon: '📝',
	},
	{
		id: ComponentCategory.FORM_SELECT,
		name: '表单选择',
		description: '选择类组件',
		icon: '🔽',
	},
	{
		id: ComponentCategory.FORM_DATE,
		name: '日期时间',
		description: '日期时间选择组件',
		icon: '📅',
	},
	{
		id: ComponentCategory.FORM_LAYOUT,
		name: '表单布局',
		description: '布局和容器组件',
		icon: '📦',
	},
	{
		id: ComponentCategory.DATA_ENTRY,
		name: '数据录入',
		description: '复杂数据录入组件',
		icon: '📊',
	},
	{
		id: ComponentCategory.DISPLAY,
		name: '数据展示',
		description: '展示类组件',
		icon: '📋',
	},
	{
		id: ComponentCategory.FEEDBACK,
		name: '反馈组件',
		description: '用户反馈组件',
		icon: '💬',
	},
	{
		id: ComponentCategory.NAVIGATION,
		name: '导航组件',
		description: '导航和步骤组件',
		icon: '🧭',
	},
];
