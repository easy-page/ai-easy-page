import { FunctionProperty } from './specialProperties';

// 通用组件属性
export interface CommonComponentProps {
	placeholder?: string;
	disabled?: boolean;
	style?: Record<string, any>;
	className?: string;
}

// Input 组件属性 Schema
export interface InputPropsSchema {
	type: 'input';
	properties: CommonComponentProps & {
		type?: 'text' | 'password' | 'number' | 'email' | 'url';
		maxLength?: number;
		showCount?: boolean;
		allowClear?: boolean;
		prefix?: string;
		suffix?: string;
	};
}

// Select 组件属性 Schema
export interface SelectPropsSchema {
	type: 'select';
	properties: CommonComponentProps & {
		options?: Array<{ label: string; value: any }>;
		mode?: 'multiple' | 'tags';
		allowClear?: boolean;
		showSearch?: boolean;
		remoteSearch?: boolean;
		onSearch?: FunctionProperty;
	};
}

// Checkbox 组件属性 Schema
export interface CheckboxPropsSchema {
	type: 'checkbox';
	properties: CommonComponentProps & {
		indeterminate?: boolean;
	};
}

// CheckboxGroup 组件属性 Schema
export interface CheckboxGroupPropsSchema {
	type: 'checkboxGroup';
	properties: CommonComponentProps & {
		options?: Array<{ label: string; value: any }>;
	};
}

// Radio 组件属性 Schema
export interface RadioPropsSchema {
	type: 'radio';
	properties: CommonComponentProps;
}

// RadioGroup 组件属性 Schema
export interface RadioGroupPropsSchema {
	type: 'radioGroup';
	properties: CommonComponentProps & {
		options?: Array<{ label: string; value: any }>;
		optionType?: 'default' | 'button';
	};
}

// TextArea 组件属性 Schema
export interface TextAreaPropsSchema {
	type: 'textArea';
	properties: CommonComponentProps & {
		rows?: number;
		maxLength?: number;
		showCount?: boolean;
		autoSize?: boolean | { minRows?: number; maxRows?: number };
	};
}

// DatePicker 组件属性 Schema
export interface DatePickerPropsSchema {
	type: 'datePicker';
	properties: CommonComponentProps & {
		format?: string;
		showTime?: boolean;
		allowClear?: boolean;
	};
}

// DateRangePicker 组件属性 Schema
export interface DateRangePickerPropsSchema {
	type: 'dateRangePicker';
	properties: CommonComponentProps & {
		format?: string;
		showTime?: boolean;
		allowClear?: boolean;
	};
}

// TimePicker 组件属性 Schema
export interface TimePickerPropsSchema {
	type: 'timePicker';
	properties: CommonComponentProps & {
		format?: string;
		showNow?: boolean;
		allowClear?: boolean;
	};
}

// Container 组件属性 Schema
export interface ContainerPropsSchema {
	type: 'container';
	properties: CommonComponentProps & {
		title?: string;
		collapsible?: boolean;
		defaultCollapsed?: boolean;
	};
}

// DynamicForm 组件属性 Schema
export interface DynamicFormPropsSchema {
	type: 'dynamicForm';
	properties: CommonComponentProps;
}

// Custom 组件属性 Schema
export interface CustomPropsSchema {
	type: 'custom';
	properties: CommonComponentProps & {
		componentName?: string;
		componentId?: string;
		description?: string;
		content?: string;
	};
}

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
	componentType: string
): ComponentPropsSchema {
	const baseProps = {
		placeholder: '',
		disabled: false,
		style: {},
		className: '',
	};

	switch (componentType) {
		case 'Input':
			return {
				type: 'input',
				properties: {
					...baseProps,
					type: 'text',
					allowClear: true,
				},
			} as InputPropsSchema;
		case 'Select':
			return {
				type: 'select',
				properties: {
					...baseProps,
					options: [],
					allowClear: true,
					showSearch: false,
				},
			} as SelectPropsSchema;
		case 'CheckboxGroup':
		case 'RadioGroup':
			return {
				type:
					componentType === 'CheckboxGroup' ? 'checkboxGroup' : 'radioGroup',
				properties: {
					...baseProps,
					options: [],
				},
			} as CheckboxGroupPropsSchema | RadioGroupPropsSchema;
		case 'TextArea':
			return {
				type: 'textArea',
				properties: {
					...baseProps,
					rows: 4,
					showCount: false,
				},
			} as TextAreaPropsSchema;
		case 'DatePicker':
			return {
				type: 'datePicker',
				properties: {
					...baseProps,
					format: 'YYYY-MM-DD',
					allowClear: true,
				},
			} as DatePickerPropsSchema;
		case 'DateRangePicker':
			return {
				type: 'dateRangePicker',
				properties: {
					...baseProps,
					format: 'YYYY-MM-DD',
					allowClear: true,
				},
			} as DateRangePickerPropsSchema;
		case 'TimePicker':
			return {
				type: 'timePicker',
				properties: {
					...baseProps,
					format: 'HH:mm:ss',
					allowClear: true,
				},
			} as TimePickerPropsSchema;
		case 'Container':
			return {
				type: 'container',
				properties: {
					...baseProps,
					title: '容器',
					collapsible: false,
				},
			} as ContainerPropsSchema;
		case 'Custom':
			return {
				type: 'custom',
				properties: {
					...baseProps,
					componentName: '自定义组件',
					componentId: 'custom-component',
					description: '这是一个自定义组件',
					content: '// 在这里编写自定义组件代码\nreturn <div>自定义组件</div>;',
				},
			} as CustomPropsSchema;
		default:
			return {
				type: 'input',
				properties: baseProps,
			} as InputPropsSchema;
	}
}
