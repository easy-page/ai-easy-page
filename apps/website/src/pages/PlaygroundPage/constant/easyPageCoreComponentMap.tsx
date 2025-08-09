import * as React from 'react';
import { Form, FormItem, When } from '@easy-page/core';
import {
	Input,
	Select,
	Checkbox,
	CheckboxGroup,
	Radio,
	RadioGroup,
	TextArea,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,
	DynamicForm,
	Tab,
	Steps,
	Drawer,
	Switch,
	InputNumber,
	Slider,
	Rate,
	AutoComplete,
	Cascader,
	Transfer,
	TreeSelect,
} from '@easy-page/pc';
import { ComponentType } from './componentTypes';

// Easy-Page 核心组件映射表（用于预览和渲染）
export const EASY_PAGE_CORE_COMPONENT_MAP: Partial<
	Record<ComponentType, React.ComponentType<any>>
> = {
	Input,
	Select,
	Checkbox,
	CheckboxGroup,
	Radio,
	RadioGroup,
	TextArea,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,
	DynamicForm,
};

// Easy-Page 扩展组件映射表（包含所有PC组件）
export const EASY_PAGE_EXTENDED_COMPONENT_MAP: Record<
	string,
	React.ComponentType<any>
> = {
	// 核心组件
	Form,
	FormItem,
	When,
	DynamicForm,

	// PC 组件
	Input,
	Select,
	Checkbox,
	CheckboxGroup,
	Radio,
	RadioGroup,
	TextArea,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,
	Tab,
	Steps,
	Drawer,
	Switch,
	InputNumber,
	Slider,
	Rate,
	AutoComplete,
	Cascader,
	Transfer,
	TreeSelect,

	// 占位符组件
	EmptyNode: () => <div style={{ color: 'white' }}>暂无内容</div>,
	// 简单文本组件：直接渲染文本
	OnlyText: ((props: { text?: string }) => {
		console.log('qweqwqwew1232132132qe:', props);
		return <>{props.text ?? ''}</>;
	}) as unknown as React.ComponentType<any>,
};

// 获取组件
export const getEasyPageComponent = (
	name: string
): React.ComponentType<any> | undefined => {
	return EASY_PAGE_EXTENDED_COMPONENT_MAP[name];
};

// 检查组件是否存在
export const hasEasyPageComponent = (name: string): boolean => {
	return name in EASY_PAGE_EXTENDED_COMPONENT_MAP;
};

// 获取所有组件名称
export const getEasyPageComponentNames = (): string[] => {
	return Object.keys(EASY_PAGE_EXTENDED_COMPONENT_MAP);
};

// 获取核心组件名称（用于预览）
export const getEasyPageCoreComponentNames = (): ComponentType[] => {
	return Object.keys(EASY_PAGE_CORE_COMPONENT_MAP) as ComponentType[];
};
