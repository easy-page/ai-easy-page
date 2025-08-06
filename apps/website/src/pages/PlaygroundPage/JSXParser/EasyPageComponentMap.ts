import * as React from 'react';
import { DynamicForm, Form, FormItem, When } from '@easy-page/core';
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
} from '@easy-page/pc';

// Easy-Page 组件映射表
export const EASY_PAGE_COMPONENT_MAP: Record<
	string,
	React.ComponentType<any>
> = {
	// Core 组件
	DynamicForm,
	Form,
	FormItem,
	When,

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
};

// 获取所有组件名称
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
