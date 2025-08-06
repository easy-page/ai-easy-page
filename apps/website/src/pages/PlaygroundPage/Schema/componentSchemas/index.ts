// 导出通用类型
export * from './types';

// 导出 Input 组件
export * from './input';

// 导出 Select 组件
export * from './select';

// 导出 Checkbox 组件
export * from './checkbox';

// 导出 Radio 组件
export * from './radio';

// 导出 TextArea 组件
export * from './textarea';

// 导出 DatePicker 组件
export * from './datePicker';

// 导出 Container 组件
export * from './container';

// 导出 DynamicForm 组件
export * from './dynamicForm';

// 导出 Custom 组件
export * from './custom';

// 导入所有组件的类型定义
import { InputPropsSchema, getDefaultInputProps } from './input';
import { SelectPropsSchema, getDefaultSelectProps } from './select';
import {
	CheckboxPropsSchema,
	CheckboxGroupPropsSchema,
	getDefaultCheckboxProps,
	getDefaultCheckboxGroupProps,
} from './checkbox';
import {
	RadioPropsSchema,
	RadioGroupPropsSchema,
	getDefaultRadioProps,
	getDefaultRadioGroupProps,
} from './radio';
import { TextAreaPropsSchema, getDefaultTextAreaProps } from './textarea';
import {
	DatePickerPropsSchema,
	DateRangePickerPropsSchema,
	TimePickerPropsSchema,
	getDefaultDatePickerProps,
	getDefaultDateRangePickerProps,
	getDefaultTimePickerProps,
} from './datePicker';
import { ContainerPropsSchema, getDefaultContainerProps } from './container';
import {
	DynamicFormPropsSchema,
	getDefaultDynamicFormProps,
} from './dynamicForm';
import { CustomPropsSchema, getDefaultCustomProps } from './custom';
import { ComponentType } from '../../constant/componentTypes';

// 组件属性 Schema 联合类型
export type ComponentPropsSchema =
	| InputPropsSchema
	| SelectPropsSchema
	| CheckboxPropsSchema
	| CheckboxGroupPropsSchema
	| RadioPropsSchema
	| RadioGroupPropsSchema
	| TextAreaPropsSchema
	| DatePickerPropsSchema
	| DateRangePickerPropsSchema
	| TimePickerPropsSchema
	| ContainerPropsSchema
	| DynamicFormPropsSchema
	| CustomPropsSchema;

// 组件类型到Schema的映射
export const ComponentPropsSchemaMap = {
	Input: {} as InputPropsSchema,
	Select: {} as SelectPropsSchema,
	Checkbox: {} as CheckboxPropsSchema,
	CheckboxGroup: {} as CheckboxGroupPropsSchema,
	Radio: {} as RadioPropsSchema,
	RadioGroup: {} as RadioGroupPropsSchema,
	TextArea: {} as TextAreaPropsSchema,
	DatePicker: {} as DatePickerPropsSchema,
	DateRangePicker: {} as DateRangePickerPropsSchema,
	TimePicker: {} as TimePickerPropsSchema,
	Container: {} as ContainerPropsSchema,
	DynamicForm: {} as DynamicFormPropsSchema,
	Custom: {} as CustomPropsSchema,
};

// 获取组件的默认属性Schema
export function getDefaultComponentPropsSchema(
	componentType: ComponentType
): ComponentPropsSchema {
	switch (componentType) {
		case 'Input':
			return getDefaultInputProps();
		case 'Select':
			return getDefaultSelectProps();
		case 'CheckboxGroup':
			return getDefaultCheckboxGroupProps();
		case 'Checkbox':
			return getDefaultCheckboxProps();
		case 'RadioGroup':
			return getDefaultRadioGroupProps();
		case 'Radio':
			return getDefaultRadioProps();
		case 'TextArea':
			return getDefaultTextAreaProps();
		case 'DatePicker':
			return getDefaultDatePickerProps();
		case 'DateRangePicker':
			return getDefaultDateRangePickerProps();
		case 'TimePicker':
			return getDefaultTimePickerProps();
		case 'Container':
			return getDefaultContainerProps();
		case 'DynamicForm':
			return getDefaultDynamicFormProps();
		case 'Custom':
			return getDefaultCustomProps();
		default:
			return getDefaultInputProps();
	}
}
