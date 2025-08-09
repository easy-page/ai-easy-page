import { ComponentType } from './types';

// 组件配置接口
export interface ComponentConfig {
	// 是否可以使用FormItem包裹
	canUseFormItem: boolean;
	// 是否需要Form包裹
	needForm?: boolean;
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
		needForm: true,
		description: '容器组件，用于组织其他组件，需要Form包裹但不需要FormItem',
		note: '容器组件需要Form包裹以支持表单功能，但不需要FormItem包裹',
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
	// 新增表单组件
	[ComponentType.TAB]: {
		canUseFormItem: true,
		description: '标签页组件，支持多标签内容切换',
	},
	[ComponentType.STEPS]: {
		canUseFormItem: true,
		description: '步骤条组件，用于显示流程步骤',
	},
	[ComponentType.DRAWER]: {
		canUseFormItem: true,
		description: '抽屉组件，从屏幕边缘滑出的面板',
	},
	[ComponentType.SWITCH]: {
		canUseFormItem: true,
		description: '开关组件，用于切换状态',
	},
	[ComponentType.INPUT_NUMBER]: {
		canUseFormItem: true,
		description: '数字输入框组件，支持数字输入和格式化',
	},
	[ComponentType.SLIDER]: {
		canUseFormItem: true,
		description: '滑块组件，用于选择数值范围',
	},
	[ComponentType.RATE]: {
		canUseFormItem: true,
		description: '评分组件，用于星级评分',
	},
	[ComponentType.AUTO_COMPLETE]: {
		canUseFormItem: true,
		description: '自动完成组件，支持输入建议',
	},
	[ComponentType.CASCADER]: {
		canUseFormItem: true,
		description: '级联选择组件，支持多级数据选择',
	},
	[ComponentType.TRANSFER]: {
		canUseFormItem: true,
		description: '穿梭框组件，用于在两个列表间移动数据',
	},
	[ComponentType.TREE_SELECT]: {
		canUseFormItem: true,
		description: '树选择组件，支持树形数据选择',
	},
	// 非表单组件
	[ComponentType.BUTTON]: {
		canUseFormItem: false,
		description: '按钮组件，用于触发操作',
		note: '按钮组件通常不需要FormItem包裹',
	},
	[ComponentType.ICON]: {
		canUseFormItem: false,
		description: '图标组件，用于显示图标',
		note: '图标组件通常不需要FormItem包裹',
	},
	[ComponentType.DIVIDER]: {
		canUseFormItem: false,
		description: '分割线组件，用于分隔内容',
		note: '分割线组件通常不需要FormItem包裹',
	},
	[ComponentType.ALERT]: {
		canUseFormItem: false,
		description: '警告提示组件，用于显示警告信息',
		note: '警告提示组件通常不需要FormItem包裹',
	},
	[ComponentType.CARD]: {
		canUseFormItem: false,
		description: '卡片组件，用于展示内容',
		note: '卡片组件通常不需要FormItem包裹',
	},
	[ComponentType.TAG]: {
		canUseFormItem: false,
		description: '标签组件，用于标记和分类',
		note: '标签组件通常不需要FormItem包裹',
	},
	[ComponentType.BADGE]: {
		canUseFormItem: false,
		description: '徽标组件，用于显示通知数量',
		note: '徽标组件通常不需要FormItem包裹',
	},
	[ComponentType.PROGRESS]: {
		canUseFormItem: false,
		description: '进度条组件，用于显示进度',
		note: '进度条组件通常不需要FormItem包裹',
	},
	[ComponentType.SPIN]: {
		canUseFormItem: false,
		description: '加载组件，用于显示加载状态',
		note: '加载组件通常不需要FormItem包裹',
	},
	[ComponentType.EMPTY]: {
		canUseFormItem: false,
		description: '空状态组件，用于显示空数据状态',
		note: '空状态组件通常不需要FormItem包裹',
	},
	[ComponentType.RESULT]: {
		canUseFormItem: false,
		description: '结果页组件，用于显示操作结果',
		note: '结果页组件通常不需要FormItem包裹',
	},
	// 原生 HTML 元素
	[ComponentType.DIV]: {
		canUseFormItem: false,
		description: 'HTML 块级容器',
		note: '原生元素直接渲染，不使用 FormItem 包裹',
	},
	[ComponentType.SPAN]: {
		canUseFormItem: false,
		description: 'HTML 行内容器',
	},
	[ComponentType.P]: {
		canUseFormItem: false,
		description: 'HTML 段落文本',
	},
	[ComponentType.A]: {
		canUseFormItem: false,
		description: 'HTML 超链接',
	},
	[ComponentType.UL]: {
		canUseFormItem: false,
		description: 'HTML 无序列表',
	},
	[ComponentType.LI]: {
		canUseFormItem: false,
		description: 'HTML 列表项',
	},
	[ComponentType.CANVAS]: {
		canUseFormItem: false,
		description: 'HTML 画布元素',
	},
	[ComponentType.IFRAME]: {
		canUseFormItem: false,
		description: 'HTML 内联框架',
	},
	[ComponentType.ONLY_TEXT]: {
		canUseFormItem: false,
		description: '纯文本组件，用于显示纯文本',
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

// 检查组件是否需要Form包裹
export const needForm = (componentType: ComponentType): boolean => {
	return COMPONENT_CONFIG[componentType]?.needForm ?? false;
};

// 获取所有不能使用FormItem的组件类型
export const getNonFormItemComponents = (): ComponentType[] => {
	return Object.entries(COMPONENT_CONFIG)
		.filter(([_, config]) => !config.canUseFormItem)
		.map(([type]) => type as ComponentType);
};

// 获取所有需要Form包裹的组件类型
export const getNeedFormComponents = (): ComponentType[] => {
	return Object.entries(COMPONENT_CONFIG)
		.filter(([_, config]) => config.needForm)
		.map(([type]) => type as ComponentType);
};
