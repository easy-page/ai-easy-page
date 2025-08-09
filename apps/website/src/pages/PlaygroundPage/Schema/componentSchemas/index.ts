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
export * from './text';

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
import { TextSchema, getDefaultTextProps } from './text';
import { ComponentType } from '../../constant/componentTypes';
import {
	type DivPropsSchema,
	type SpanPropsSchema,
	type PPropsSchema,
	type APropsSchema,
	type UlPropsSchema,
	type LiPropsSchema,
	type CanvasPropsSchema,
	type IframePropsSchema,
	getDefaultPProps,
	getDefaultAProps,
	getDefaultUlProps,
	getDefaultLiProps,
	getDefaultCanvasProps,
	getDefaultIframeProps,
	getDefaultDivProps,
	getDefaultSpanProps,
} from './native';

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
	| CustomPropsSchema
	| DivPropsSchema
	| SpanPropsSchema
	| PPropsSchema
	| APropsSchema
	| UlPropsSchema
	| LiPropsSchema
	| CanvasPropsSchema
	| IframePropsSchema;
  // text 是简单节点，直接用 TextSchema（properties: { text: string }）
export type SimpleTextSchema = TextSchema;

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
	// 原生 HTML 元素
	div: {} as DivPropsSchema,
	span: {} as SpanPropsSchema,
	p: {} as PPropsSchema,
	a: {} as APropsSchema,
	ul: {} as UlPropsSchema,
	li: {} as LiPropsSchema,
	canvas: {} as CanvasPropsSchema,
	iframe: {} as IframePropsSchema,
  text: {} as TextSchema,
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
		// HTML 原生元素默认 props
		case 'div':
			return getDefaultDivProps();
		case 'span':
			return getDefaultSpanProps();
		case 'p':
			return getDefaultPProps();
		case 'a':
			return getDefaultAProps();
		case 'ul':
			return getDefaultUlProps();
		case 'li':
			return getDefaultLiProps();
		case 'canvas':
			return getDefaultCanvasProps();
		case 'iframe':
			return getDefaultIframeProps();
    case 'text':
      return getDefaultTextProps();
		default:
			return getDefaultInputProps();
	}
}
