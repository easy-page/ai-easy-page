// 组件类型枚举
export enum ComponentType {
	INPUT = 'Input',
	SELECT = 'Select',
	CHECKBOX = 'Checkbox',
	CHECKBOX_GROUP = 'CheckboxGroup',
	RADIO = 'Radio',
	RADIO_GROUP = 'RadioGroup',
	TEXTAREA = 'TextArea',
	DATE_PICKER = 'DatePicker',
	DATE_RANGE_PICKER = 'DateRangePicker',
	TIME_PICKER = 'TimePicker',
	CONTAINER = 'Container',
	DYNAMIC_FORM = 'DynamicForm',
	CUSTOM = 'Custom',
	// 新增表单组件
	TAB = 'Tab',
	STEPS = 'Steps',
	DRAWER = 'Drawer',
	SWITCH = 'Switch',
	INPUT_NUMBER = 'InputNumber',
	SLIDER = 'Slider',
	RATE = 'Rate',
	AUTO_COMPLETE = 'AutoComplete',
	CASCADER = 'Cascader',
	TRANSFER = 'Transfer',
	TREE_SELECT = 'TreeSelect',
	// 非表单组件（直接使用antd）
	BUTTON = 'Button',
	ICON = 'Icon',
	DIVIDER = 'Divider',
	ALERT = 'Alert',
	CARD = 'Card',
	TAG = 'Tag',
	BADGE = 'Badge',
	PROGRESS = 'Progress',
	SPIN = 'Spin',
	EMPTY = 'Empty',
	RESULT = 'Result',
}

// 组件类型数组，用于下拉选择
export const ComponentTypeOptions = [
	{ label: '输入框', value: ComponentType.INPUT },
	{ label: '下拉选择', value: ComponentType.SELECT },
	{ label: '复选框', value: ComponentType.CHECKBOX },
	{ label: '复选框组', value: ComponentType.CHECKBOX_GROUP },
	{ label: '单选框', value: ComponentType.RADIO },
	{ label: '单选框组', value: ComponentType.RADIO_GROUP },
	{ label: '文本域', value: ComponentType.TEXTAREA },
	{ label: '日期选择器', value: ComponentType.DATE_PICKER },
	{ label: '日期范围选择器', value: ComponentType.DATE_RANGE_PICKER },
	{ label: '时间选择器', value: ComponentType.TIME_PICKER },
	{ label: '容器', value: ComponentType.CONTAINER },
	{ label: '动态表单', value: ComponentType.DYNAMIC_FORM },
	{ label: '自定义组件', value: ComponentType.CUSTOM },
	// 新增表单组件
	{ label: '标签页', value: ComponentType.TAB },
	{ label: '步骤条', value: ComponentType.STEPS },
	{ label: '抽屉', value: ComponentType.DRAWER },
	{ label: '开关', value: ComponentType.SWITCH },
	{ label: '数字输入框', value: ComponentType.INPUT_NUMBER },
	{ label: '滑块', value: ComponentType.SLIDER },
	{ label: '评分', value: ComponentType.RATE },
	{ label: '自动完成', value: ComponentType.AUTO_COMPLETE },
	{ label: '级联选择', value: ComponentType.CASCADER },
	{ label: '穿梭框', value: ComponentType.TRANSFER },
	{ label: '树选择', value: ComponentType.TREE_SELECT },
	// 非表单组件
	{ label: '按钮', value: ComponentType.BUTTON },
	{ label: '图标', value: ComponentType.ICON },
	{ label: '分割线', value: ComponentType.DIVIDER },
	{ label: '警告提示', value: ComponentType.ALERT },
	{ label: '卡片', value: ComponentType.CARD },
	{ label: '标签', value: ComponentType.TAG },
	{ label: '徽标', value: ComponentType.BADGE },
	{ label: '进度条', value: ComponentType.PROGRESS },
	{ label: '加载中', value: ComponentType.SPIN },
	{ label: '空状态', value: ComponentType.EMPTY },
	{ label: '结果页', value: ComponentType.RESULT },
];

// 组件显示名称映射
export const ComponentDisplayNames: Record<ComponentType, string> = {
	[ComponentType.INPUT]: '输入框',
	[ComponentType.SELECT]: '下拉选择',
	[ComponentType.CHECKBOX]: '复选框',
	[ComponentType.CHECKBOX_GROUP]: '复选框组',
	[ComponentType.RADIO]: '单选框',
	[ComponentType.RADIO_GROUP]: '单选框组',
	[ComponentType.TEXTAREA]: '文本域',
	[ComponentType.DATE_PICKER]: '日期选择器',
	[ComponentType.DATE_RANGE_PICKER]: '日期范围选择器',
	[ComponentType.TIME_PICKER]: '时间选择器',
	[ComponentType.CONTAINER]: '容器',
	[ComponentType.DYNAMIC_FORM]: '动态表单',
	[ComponentType.CUSTOM]: '自定义组件',
	// 新增表单组件
	[ComponentType.TAB]: '标签页',
	[ComponentType.STEPS]: '步骤条',
	[ComponentType.DRAWER]: '抽屉',
	[ComponentType.SWITCH]: '开关',
	[ComponentType.INPUT_NUMBER]: '数字输入框',
	[ComponentType.SLIDER]: '滑块',
	[ComponentType.RATE]: '评分',
	[ComponentType.AUTO_COMPLETE]: '自动完成',
	[ComponentType.CASCADER]: '级联选择',
	[ComponentType.TRANSFER]: '穿梭框',
	[ComponentType.TREE_SELECT]: '树选择',
	// 非表单组件
	[ComponentType.BUTTON]: '按钮',
	[ComponentType.ICON]: '图标',
	[ComponentType.DIVIDER]: '分割线',
	[ComponentType.ALERT]: '警告提示',
	[ComponentType.CARD]: '卡片',
	[ComponentType.TAG]: '标签',
	[ComponentType.BADGE]: '徽标',
	[ComponentType.PROGRESS]: '进度条',
	[ComponentType.SPIN]: '加载中',
	[ComponentType.EMPTY]: '空状态',
	[ComponentType.RESULT]: '结果页',
};

// 组件属性定义
export interface ComponentProps {
	// 通用属性
	id?: string;
	placeholder?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

// Input 组件属性
export interface InputProps extends ComponentProps {
	type?: 'text' | 'password' | 'number' | 'email' | 'url';
	maxLength?: number;
	showCount?: boolean;
	allowClear?: boolean;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
}

// Select 组件属性
export interface SelectProps extends ComponentProps {
	options?: Array<{ label: string; value: any }>;
	mode?: 'multiple' | 'tags';
	allowClear?: boolean;
	showSearch?: boolean;
	remoteSearch?: boolean;
	onSearch?: (keyword: string) => Promise<any[]>;
}

// Checkbox 组件属性
export interface CheckboxProps extends ComponentProps {
	indeterminate?: boolean;
}

// CheckboxGroup 组件属性
export interface CheckboxGroupProps extends ComponentProps {
	options?: Array<{ label: string; value: any }>;
}

// Radio 组件属性
export interface RadioProps extends ComponentProps {
	// Radio 组件本身属性较少
}

// RadioGroup 组件属性
export interface RadioGroupProps extends ComponentProps {
	options?: Array<{ label: string; value: any }>;
	optionType?: 'default' | 'button';
}

// TextArea 组件属性
export interface TextAreaProps extends ComponentProps {
	rows?: number;
	maxLength?: number;
	showCount?: boolean;
	autoSize?: boolean | { minRows?: number; maxRows?: number };
}

// DatePicker 组件属性
export interface DatePickerProps extends ComponentProps {
	format?: string;
	showTime?: boolean;
	allowClear?: boolean;
}

// DateRangePicker 组件属性
export interface DateRangePickerProps extends ComponentProps {
	format?: string;
	showTime?: boolean;
	allowClear?: boolean;
}

// TimePicker 组件属性
export interface TimePickerProps extends ComponentProps {
	format?: string;
	showNow?: boolean;
	allowClear?: boolean;
}

// Container 组件属性
export interface ContainerProps extends ComponentProps {
	title?: string;
	collapsible?: boolean;
	defaultCollapsed?: boolean;
}

// DynamicForm 组件属性
export interface DynamicFormProps extends ComponentProps {
	// DynamicForm 的特殊属性
}

// Custom 组件属性
export interface CustomProps extends ComponentProps {
	content?: string; // 自定义组件的代码内容
}

// Tab 组件属性
export interface TabProps extends ComponentProps {
	items?: Array<{ key: string; label: string; children?: React.ReactNode }>;
	type?: 'line' | 'card' | 'editable-card';
	position?: 'top' | 'right' | 'bottom' | 'left';
}

// Steps 组件属性
export interface StepsProps extends ComponentProps {
	items?: Array<{ title: string; description?: string; subTitle?: string }>;
	direction?: 'horizontal' | 'vertical';
	size?: 'default' | 'small';
	status?: 'wait' | 'process' | 'finish' | 'error';
}

// Drawer 组件属性
export interface DrawerProps extends ComponentProps {
	title?: string;
	placement?: 'top' | 'right' | 'bottom' | 'left';
	width?: number | string;
	height?: number | string;
	closable?: boolean;
	maskClosable?: boolean;
}

// Switch 组件属性
export interface SwitchProps extends ComponentProps {
	checkedChildren?: React.ReactNode;
	unCheckedChildren?: React.ReactNode;
	size?: 'default' | 'small';
}

// InputNumber 组件属性
export interface InputNumberProps extends ComponentProps {
	min?: number;
	max?: number;
	step?: number;
	precision?: number;
	formatter?: (value: number | string) => string;
	parser?: (value: string) => number;
}

// Slider 组件属性
export interface SliderProps extends ComponentProps {
	min?: number;
	max?: number;
	step?: number;
	range?: boolean;
	marks?: Record<number, React.ReactNode>;
	tooltip?: boolean | { formatter?: (value: number) => string };
}

// Rate 组件属性
export interface RateProps extends ComponentProps {
	count?: number;
	allowHalf?: boolean;
	character?: React.ReactNode;
	tooltips?: string[];
}

// AutoComplete 组件属性
export interface AutoCompleteProps extends ComponentProps {
	options?: Array<{ label: string; value: string }>;
	onSearch?: (value: string) => void;
	onSelect?: (value: string, option: any) => void;
}

// Cascader 组件属性
export interface CascaderProps extends ComponentProps {
	options?: any[];
	expandTrigger?: 'click' | 'hover';
	changeOnSelect?: boolean;
	showSearch?: boolean;
}

// Transfer 组件属性
export interface TransferProps extends ComponentProps {
	dataSource?: Array<{ key: string; title: string; description?: string }>;
	titles?: [string, string];
	showSearch?: boolean;
	showSelectAll?: boolean;
}

// TreeSelect 组件属性
export interface TreeSelectProps extends ComponentProps {
	treeData?: any[];
	treeCheckable?: boolean;
	treeDefaultExpandAll?: boolean;
	showSearch?: boolean;
	allowClear?: boolean;
}

// 非表单组件属性（简单包装）
export interface ButtonProps extends ComponentProps {
	type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
	size?: 'large' | 'middle' | 'small';
	icon?: React.ReactNode;
	loading?: boolean;
}

export interface IconProps extends ComponentProps {
	type?: string;
	spin?: boolean;
	rotate?: number;
}

export interface DividerProps extends ComponentProps {
	type?: 'horizontal' | 'vertical';
	orientation?: 'left' | 'right' | 'center';
	plain?: boolean;
}

export interface AlertProps extends ComponentProps {
	type?: 'success' | 'info' | 'warning' | 'error';
	message?: string;
	description?: string;
	showIcon?: boolean;
	closable?: boolean;
}

export interface CardProps extends ComponentProps {
	title?: string;
	extra?: React.ReactNode;
	bordered?: boolean;
	size?: 'default' | 'small';
}

export interface TagProps extends ComponentProps {
	color?: string;
	closable?: boolean;
	icon?: React.ReactNode;
}

export interface BadgeProps extends ComponentProps {
	count?: number | React.ReactNode;
	showZero?: boolean;
	overflowCount?: number;
	dot?: boolean;
}

export interface ProgressProps extends ComponentProps {
	percent?: number;
	status?: 'success' | 'exception' | 'normal' | 'active';
	strokeWidth?: number;
	showInfo?: boolean;
}

export interface SpinProps extends ComponentProps {
	spinning?: boolean;
	size?: 'small' | 'default' | 'large';
	tip?: string;
}

export interface EmptyProps extends ComponentProps {
	image?: React.ReactNode;
	description?: string;
}

export interface ResultProps extends ComponentProps {
	status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
	title?: string;
	subTitle?: string;
	extra?: React.ReactNode;
}

// FormItem 属性
export interface FormItemProps {
	label?: string;
	required?: boolean;
	validate?: any[];
	validateEffects?: any[];
	effects?: any[];
	actions?: any[];
	req?: any;
	extra?: React.ReactNode | ((params: any) => React.ReactNode);
	tips?: string;
	help?: string;
	labelLayout?: 'vertical' | 'horizontal';
	labelWidth?: number | string;
	noLabel?: boolean;
}

// 组件属性映射
export const ComponentPropsMap: Record<ComponentType, any> = {
	[ComponentType.INPUT]: {} as InputProps,
	[ComponentType.SELECT]: {} as SelectProps,
	[ComponentType.CHECKBOX]: {} as CheckboxProps,
	[ComponentType.CHECKBOX_GROUP]: {} as CheckboxGroupProps,
	[ComponentType.RADIO]: {} as RadioProps,
	[ComponentType.RADIO_GROUP]: {} as RadioGroupProps,
	[ComponentType.TEXTAREA]: {} as TextAreaProps,
	[ComponentType.DATE_PICKER]: {} as DatePickerProps,
	[ComponentType.DATE_RANGE_PICKER]: {} as DateRangePickerProps,
	[ComponentType.TIME_PICKER]: {} as TimePickerProps,
	[ComponentType.CONTAINER]: {} as ContainerProps,
	[ComponentType.DYNAMIC_FORM]: {} as DynamicFormProps,
	[ComponentType.CUSTOM]: {} as CustomProps,
	// 新增表单组件
	[ComponentType.TAB]: {} as TabProps,
	[ComponentType.STEPS]: {} as StepsProps,
	[ComponentType.DRAWER]: {} as DrawerProps,
	[ComponentType.SWITCH]: {} as SwitchProps,
	[ComponentType.INPUT_NUMBER]: {} as InputNumberProps,
	[ComponentType.SLIDER]: {} as SliderProps,
	[ComponentType.RATE]: {} as RateProps,
	[ComponentType.AUTO_COMPLETE]: {} as AutoCompleteProps,
	[ComponentType.CASCADER]: {} as CascaderProps,
	[ComponentType.TRANSFER]: {} as TransferProps,
	[ComponentType.TREE_SELECT]: {} as TreeSelectProps,
	// 非表单组件
	[ComponentType.BUTTON]: {} as ButtonProps,
	[ComponentType.ICON]: {} as IconProps,
	[ComponentType.DIVIDER]: {} as DividerProps,
	[ComponentType.ALERT]: {} as AlertProps,
	[ComponentType.CARD]: {} as CardProps,
	[ComponentType.TAG]: {} as TagProps,
	[ComponentType.BADGE]: {} as BadgeProps,
	[ComponentType.PROGRESS]: {} as ProgressProps,
	[ComponentType.SPIN]: {} as SpinProps,
	[ComponentType.EMPTY]: {} as EmptyProps,
	[ComponentType.RESULT]: {} as ResultProps,
};

// 获取组件的默认属性
// 注意：此函数已被 getDefaultComponentPropsSchema 替代，请使用 Schema 版本
