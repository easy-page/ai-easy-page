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
};

// 获取组件的默认属性
export function getDefaultComponentProps(type: ComponentType): any {
	const baseProps = {
		id: '',
		placeholder: '',
		disabled: false,
		style: {},
		className: '',
	};

	switch (type) {
		case ComponentType.INPUT:
			return {
				...baseProps,
				type: 'text',
				allowClear: true,
			};
		case ComponentType.SELECT:
			return {
				...baseProps,
				options: [
					{ label: '选项1', value: 'option1' },
					{ label: '选项2', value: 'option2' },
					{ label: '选项3', value: 'option3' },
				],
				allowClear: true,
				showSearch: false,
			};
		case ComponentType.CHECKBOX_GROUP:
			return {
				...baseProps,
				options: [
					{ label: '选项1', value: 'option1' },
					{ label: '选项2', value: 'option2' },
					{ label: '选项3', value: 'option3' },
				],
			};
		case ComponentType.RADIO_GROUP:
			return {
				...baseProps,
				options: [
					{ label: '选项1', value: 'option1' },
					{ label: '选项2', value: 'option2' },
					{ label: '选项3', value: 'option3' },
				],
				optionType: 'default',
			};
		case ComponentType.TEXTAREA:
			return {
				...baseProps,
				rows: 4,
				showCount: false,
			};
		case ComponentType.DATE_PICKER:
		case ComponentType.DATE_RANGE_PICKER:
			return {
				...baseProps,
				format: 'YYYY-MM-DD',
				allowClear: true,
			};
		case ComponentType.TIME_PICKER:
			return {
				...baseProps,
				format: 'HH:mm:ss',
				allowClear: true,
			};
		case ComponentType.CONTAINER:
			return {
				...baseProps,
				title: '容器',
				titleType: 'h2',
				layout: 'vertical',
				collapsible: false,
				children: [], // 容器需要子组件
			};
		case ComponentType.DYNAMIC_FORM:
			return {
				...baseProps,
				id: 'dynamic-form',
				maxRow: 10,
				minRow: 1,
				containerType: 'tab',
				rows: [
					{
						rowIndexs: [0],
						fields: [
							// 默认添加一个输入框作为示例
							{
								type: 'Input',
								props: {
									id: 'field1',
									placeholder: '请输入内容',
									allowClear: true,
								},
								isFormComponent: true,
								formItem: {
									type: 'formItem',
									properties: {
										id: 'field1',
										label: '字段1',
										required: false,
										labelLayout: 'vertical',
									},
								},
							},
						],
					},
				],
			};
		case ComponentType.CUSTOM:
			return {
				...baseProps,
				content: '// 在这里编写自定义组件代码\nreturn <div>自定义组件</div>;',
			};
		case ComponentType.CHECKBOX:
			return {
				...baseProps,
				label: '复选框',
			};
		case ComponentType.RADIO:
			return {
				...baseProps,
				label: '单选框',
				value: 'radio-value',
			};
		default:
			return baseProps;
	}
}
