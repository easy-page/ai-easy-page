import { ComponentType } from './ComponentTypes';

// 组件配置接口
export interface ComponentConfig {
	// 是否可以使用FormItem包裹
	canUseFormItem: boolean;
	// 组件描述
	description: string;
	// 特殊说明
	note?: string;
}

// 组件配置映射
export const COMPONENT_CONFIG: Record<ComponentType, ComponentConfig> = {
	[ComponentType.INPUT]: {
		canUseFormItem: true,
		description: '基础输入框组件，支持文本、密码、数字等类型输入',
	},
	[ComponentType.SELECT]: {
		canUseFormItem: true,
		description: '下拉选择组件，支持单选、多选、搜索等功能',
	},
	[ComponentType.CHECKBOX]: {
		canUseFormItem: true,
		description: '复选框组件，支持单个选项的选择',
	},
	[ComponentType.CHECKBOX_GROUP]: {
		canUseFormItem: true,
		description: '复选框组组件，支持多个选项的选择',
	},
	[ComponentType.RADIO]: {
		canUseFormItem: true,
		description: '单选框组件，支持单个选项的选择',
	},
	[ComponentType.RADIO_GROUP]: {
		canUseFormItem: true,
		description: '单选框组组件，支持多个选项中的单选',
	},
	[ComponentType.TEXTAREA]: {
		canUseFormItem: true,
		description: '文本域组件，支持多行文本输入',
	},
	[ComponentType.DATE_PICKER]: {
		canUseFormItem: true,
		description: '日期选择器组件，支持日期选择',
	},
	[ComponentType.DATE_RANGE_PICKER]: {
		canUseFormItem: true,
		description: '日期范围选择器组件，支持日期范围选择',
	},
	[ComponentType.TIME_PICKER]: {
		canUseFormItem: true,
		description: '时间选择器组件，支持时间选择',
	},
	[ComponentType.CONTAINER]: {
		canUseFormItem: false,
		description: '容器组件，用于组织其他组件，不能使用FormItem包裹',
		note: '容器组件本身就是一个布局组件，不需要FormItem包裹',
	},
	[ComponentType.DYNAMIC_FORM]: {
		canUseFormItem: false,
		description: '动态表单组件，用于创建可动态添加/删除行的表单',
		note: '动态表单组件内部已经包含了表单逻辑，不能使用FormItem包裹',
	},
	[ComponentType.CUSTOM]: {
		canUseFormItem: true,
		description: '自定义组件，支持用户自定义代码',
		note: '自定义组件可以根据需要决定是否使用FormItem包裹',
	},
};

// 获取组件配置
export const getComponentConfig = (
	componentType: ComponentType
): ComponentConfig => {
	return COMPONENT_CONFIG[componentType];
};

// 检查组件是否可以使用FormItem
export const canUseFormItem = (componentType: ComponentType): boolean => {
	return COMPONENT_CONFIG[componentType]?.canUseFormItem ?? true;
};

// 获取所有不能使用FormItem的组件类型
export const getNonFormItemComponents = (): ComponentType[] => {
	return Object.entries(COMPONENT_CONFIG)
		.filter(([_, config]) => !config.canUseFormItem)
		.map(([type]) => type as ComponentType);
};
