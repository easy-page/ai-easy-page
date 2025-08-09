import { ComponentType } from '../../../../../constant/componentTypes';
import { ComponentCategory } from '../types/componentCategories';

// 组件类型选项接口
export interface ComponentTypeOption {
	label: string;
	value: ComponentType;
	category: ComponentCategory;
	description: string;
	icon?: string;
	canUseFormItem: boolean;
	note?: string;
}

// 组件类型选项数组，包含分类信息
export const ComponentTypeOptionsWithCategory: ComponentTypeOption[] = [
	// 表单输入
	{
		label: '输入框',
		value: ComponentType.INPUT,
		category: ComponentCategory.FORM_INPUT,
		description: '基础输入框组件，支持文本、密码、数字等类型输入',
		icon: '📝',
		canUseFormItem: true,
	},
	{
		label: '文本域',
		value: ComponentType.TEXTAREA,
		category: ComponentCategory.FORM_INPUT,
		description: '文本域组件，支持多行文本输入',
		icon: '📄',
		canUseFormItem: true,
	},
	{
		label: '数字输入框',
		value: ComponentType.INPUT_NUMBER,
		category: ComponentCategory.FORM_INPUT,
		description: '数字输入框组件，支持数字输入和格式化',
		icon: '🔢',
		canUseFormItem: true,
	},
	{
		label: '开关',
		value: ComponentType.SWITCH,
		category: ComponentCategory.FORM_INPUT,
		description: '开关组件，用于切换状态',
		icon: '🔘',
		canUseFormItem: true,
	},
	{
		label: '滑块',
		value: ComponentType.SLIDER,
		category: ComponentCategory.FORM_INPUT,
		description: '滑块组件，用于选择数值范围',
		icon: '🎚️',
		canUseFormItem: true,
	},
	{
		label: '评分',
		value: ComponentType.RATE,
		category: ComponentCategory.FORM_INPUT,
		description: '评分组件，用于星级评分',
		icon: '⭐',
		canUseFormItem: true,
	},

	// 表单选择
	{
		label: '下拉选择',
		value: ComponentType.SELECT,
		category: ComponentCategory.FORM_SELECT,
		description: '下拉选择组件，支持单选、多选、搜索等功能',
		icon: '🔽',
		canUseFormItem: true,
	},
	{
		label: '复选框',
		value: ComponentType.CHECKBOX,
		category: ComponentCategory.FORM_SELECT,
		description: '复选框组件，支持单个选项的选择',
		icon: '☑️',
		canUseFormItem: true,
	},
	{
		label: '复选框组',
		value: ComponentType.CHECKBOX_GROUP,
		category: ComponentCategory.FORM_SELECT,
		description: '复选框组组件，支持多个选项的选择',
		icon: '☑️☑️',
		canUseFormItem: true,
	},
	{
		label: '单选框',
		value: ComponentType.RADIO,
		category: ComponentCategory.FORM_SELECT,
		description: '单选框组件，支持单个选项的选择',
		icon: '🔘',
		canUseFormItem: true,
	},
	{
		label: '单选框组',
		value: ComponentType.RADIO_GROUP,
		category: ComponentCategory.FORM_SELECT,
		description: '单选框组组件，支持多个选项中的单选',
		icon: '🔘🔘',
		canUseFormItem: true,
	},
	{
		label: '自动完成',
		value: ComponentType.AUTO_COMPLETE,
		category: ComponentCategory.FORM_SELECT,
		description: '自动完成组件，支持输入建议',
		icon: '🔍',
		canUseFormItem: true,
	},

	// 日期时间
	{
		label: '日期选择器',
		value: ComponentType.DATE_PICKER,
		category: ComponentCategory.FORM_DATE,
		description: '日期选择器组件，支持日期选择',
		icon: '📅',
		canUseFormItem: true,
	},
	{
		label: '日期范围选择器',
		value: ComponentType.DATE_RANGE_PICKER,
		category: ComponentCategory.FORM_DATE,
		description: '日期范围选择器组件，支持日期范围选择',
		icon: '📅📅',
		canUseFormItem: true,
	},
	{
		label: '时间选择器',
		value: ComponentType.TIME_PICKER,
		category: ComponentCategory.FORM_DATE,
		description: '时间选择器组件，支持时间选择',
		icon: '⏰',
		canUseFormItem: true,
	},

	// 表单布局
	{
		label: '容器',
		value: ComponentType.CONTAINER,
		category: ComponentCategory.FORM_LAYOUT,
		description: '容器组件，用于组织其他组件，不能使用FormItem包裹',
		icon: '📦',
		canUseFormItem: false,
		note: '容器组件本身就是一个布局组件，不需要FormItem包裹',
	},
	{
		label: '标签页',
		value: ComponentType.TAB,
		category: ComponentCategory.FORM_LAYOUT,
		description: '标签页组件，支持多标签内容切换',
		icon: '📑',
		canUseFormItem: true,
	},
	{
		label: '抽屉',
		value: ComponentType.DRAWER,
		category: ComponentCategory.FORM_LAYOUT,
		description: '抽屉组件，从屏幕边缘滑出的面板',
		icon: '🗄️',
		canUseFormItem: true,
	},

	// 数据录入
	{
		label: '动态表单',
		value: ComponentType.DYNAMIC_FORM,
		category: ComponentCategory.DATA_ENTRY,
		description: '动态表单组件，用于创建可动态添加/删除行的表单',
		icon: '📊',
		canUseFormItem: false,
		note: '动态表单组件内部已经包含了表单逻辑，不能使用FormItem包裹',
	},
	{
		label: '级联选择',
		value: ComponentType.CASCADER,
		category: ComponentCategory.DATA_ENTRY,
		description: '级联选择组件，支持多级数据选择',
		icon: '🌳',
		canUseFormItem: true,
	},
	{
		label: '穿梭框',
		value: ComponentType.TRANSFER,
		category: ComponentCategory.DATA_ENTRY,
		description: '穿梭框组件，用于在两个列表间移动数据',
		icon: '↔️',
		canUseFormItem: true,
	},
	{
		label: '树选择',
		value: ComponentType.TREE_SELECT,
		category: ComponentCategory.DATA_ENTRY,
		description: '树选择组件，支持树形数据选择',
		icon: '🌲',
		canUseFormItem: true,
	},
	{
		label: '自定义组件',
		value: ComponentType.CUSTOM,
		category: ComponentCategory.DATA_ENTRY,
		description: '自定义组件，支持用户自定义代码',
		icon: '⚙️',
		canUseFormItem: true,
		note: '自定义组件可以根据需要决定是否使用FormItem包裹',
	},

	// 数据展示
	{
		label: '卡片',
		value: ComponentType.CARD,
		category: ComponentCategory.DISPLAY,
		description: '卡片组件，用于展示内容',
		icon: '🃏',
		canUseFormItem: false,
		note: '卡片组件通常不需要FormItem包裹',
	},
	{
		label: '标签',
		value: ComponentType.TAG,
		category: ComponentCategory.DISPLAY,
		description: '标签组件，用于标记和分类',
		icon: '🏷️',
		canUseFormItem: false,
		note: '标签组件通常不需要FormItem包裹',
	},
	{
		label: '徽标',
		value: ComponentType.BADGE,
		category: ComponentCategory.DISPLAY,
		description: '徽标组件，用于显示通知数量',
		icon: '🔖',
		canUseFormItem: false,
		note: '徽标组件通常不需要FormItem包裹',
	},
	{
		label: '进度条',
		value: ComponentType.PROGRESS,
		category: ComponentCategory.DISPLAY,
		description: '进度条组件，用于显示进度',
		icon: '📊',
		canUseFormItem: false,
		note: '进度条组件通常不需要FormItem包裹',
	},
	{
		label: '空状态',
		value: ComponentType.EMPTY,
		category: ComponentCategory.DISPLAY,
		description: '空状态组件，用于显示空数据状态',
		icon: '📭',
		canUseFormItem: false,
		note: '空状态组件通常不需要FormItem包裹',
	},

	// 反馈组件
	{
		label: '警告提示',
		value: ComponentType.ALERT,
		category: ComponentCategory.FEEDBACK,
		description: '警告提示组件，用于显示警告信息',
		icon: '⚠️',
		canUseFormItem: false,
		note: '警告提示组件通常不需要FormItem包裹',
	},
	{
		label: '加载中',
		value: ComponentType.SPIN,
		category: ComponentCategory.FEEDBACK,
		description: '加载组件，用于显示加载状态',
		icon: '⏳',
		canUseFormItem: false,
		note: '加载组件通常不需要FormItem包裹',
	},
	{
		label: '结果页',
		value: ComponentType.RESULT,
		category: ComponentCategory.FEEDBACK,
		description: '结果页组件，用于显示操作结果',
		icon: '✅',
		canUseFormItem: false,
		note: '结果页组件通常不需要FormItem包裹',
	},

	// 导航组件
	{
		label: '步骤条',
		value: ComponentType.STEPS,
		category: ComponentCategory.NAVIGATION,
		description: '步骤条组件，用于显示流程步骤',
		icon: '👣',
		canUseFormItem: true,
	},
	{
		label: '按钮',
		value: ComponentType.BUTTON,
		category: ComponentCategory.NAVIGATION,
		description: '按钮组件，用于触发操作',
		icon: '🔘',
		canUseFormItem: false,
		note: '按钮组件通常不需要FormItem包裹',
	},
	{
		label: '图标',
		value: ComponentType.ICON,
		category: ComponentCategory.NAVIGATION,
		description: '图标组件，用于显示图标',
		icon: '🎨',
		canUseFormItem: false,
		note: '图标组件通常不需要FormItem包裹',
	},
	{
		label: '分割线',
		value: ComponentType.DIVIDER,
		category: ComponentCategory.NAVIGATION,
		description: '分割线组件，用于分隔内容',
		icon: '➖',
		canUseFormItem: false,
		note: '分割线组件通常不需要FormItem包裹',
	},
	// HTML 元素
	{
		label: 'div',
		value: ComponentType.DIV,
		category: ComponentCategory.HTML,
		description: 'HTML 块级容器',
		icon: '⬛',
		canUseFormItem: false,
		note: '原生元素不使用 FormItem 包裹',
	},
	{
		label: 'span',
		value: ComponentType.SPAN,
		category: ComponentCategory.HTML,
		description: 'HTML 行内容器',
		icon: '⬜',
		canUseFormItem: false,
	},
	{
		label: 'p',
		value: ComponentType.P,
		category: ComponentCategory.HTML,
		description: '段落文本',
		icon: '📄',
		canUseFormItem: false,
	},
	{
		label: 'a',
		value: ComponentType.A,
		category: ComponentCategory.HTML,
		description: '超链接',
		icon: '🔗',
		canUseFormItem: false,
	},
	{
		label: 'ul',
		value: ComponentType.UL,
		category: ComponentCategory.HTML,
		description: '无序列表',
		icon: '•',
		canUseFormItem: false,
	},
	{
		label: 'li',
		value: ComponentType.LI,
		category: ComponentCategory.HTML,
		description: '列表项',
		icon: '▪',
		canUseFormItem: false,
	},
	{
		label: 'canvas',
		value: ComponentType.CANVAS,
		category: ComponentCategory.HTML,
		description: '画布元素',
		icon: '🎨',
		canUseFormItem: false,
	},
	{
		label: 'iframe',
		value: ComponentType.IFRAME,
		category: ComponentCategory.HTML,
		description: '内联框架',
		icon: '🪟',
		canUseFormItem: false,
	},
	{
		label: '纯文本',
		value: ComponentType.ONLY_TEXT,
		category: ComponentCategory.HTML,
		description: '纯文本组件，用于显示纯文本',
		icon: '🪟',
		canUseFormItem: false,
	},
];

// 按分类获取组件选项
export const getComponentOptionsByCategory = (
	category: ComponentCategory
): ComponentTypeOption[] => {
	console.log('getComponentOptionsByCategory called with category:', category);
	console.log(
		'ComponentTypeOptionsWithCategory length:',
		ComponentTypeOptionsWithCategory.length
	);
	const result = ComponentTypeOptionsWithCategory.filter(
		(option) => option.category === category
	);
	console.log('Filtered result:', result);
	return result;
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
