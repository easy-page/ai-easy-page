import React from 'react';

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
