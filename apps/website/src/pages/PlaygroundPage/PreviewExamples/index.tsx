import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';

// 导入所有组件示例
import InputExample from './Input';
import SelectExample from './Select';
import CheckboxExample from './Checkbox';
import CheckboxGroupExample from './CheckboxGroup';
import RadioExample from './Radio';
import RadioGroupExample from './RadioGroup';
import TextAreaExample from './TextArea';
import DatePickerExample from './DatePicker';
import DateRangePickerExample from './DateRangePicker';
import TimePickerExample from './TimePicker';
import ContainerExample from './Container';
import DynamicFormExample from './DynamicForm';
import TabExample from './Tab';
import StepsExample from './Steps';
import DrawerExample from './Drawer';
import SwitchExample from './Switch';
import InputNumberExample from './InputNumber';
import SliderExample from './Slider';
import RateExample from './Rate';
import AutoCompleteExample from './AutoComplete';
import CascaderExample from './Cascader';
import TransferExample from './Transfer';
import TreeSelectExample from './TreeSelect';

// 非表单组件示例
import ButtonExample from './Button';
import IconExample from './Icon';
import DividerExample from './Divider';
import AlertExample from './Alert';
import CardExample from './Card';
import TagExample from './Tag';
import BadgeExample from './Badge';
import ProgressExample from './Progress';
import SpinExample from './Spin';
import EmptyExample from './Empty';
import ResultExample from './Result';

// 导出所有组件示例
export {
	InputExample,
	SelectExample,
	CheckboxExample,
	CheckboxGroupExample,
	RadioExample,
	RadioGroupExample,
	TextAreaExample,
	DatePickerExample,
	DateRangePickerExample,
	TimePickerExample,
	ContainerExample,
	DynamicFormExample,
	TabExample,
	StepsExample,
	DrawerExample,
	SwitchExample,
	InputNumberExample,
	SliderExample,
	RateExample,
	AutoCompleteExample,
	CascaderExample,
	TransferExample,
	TreeSelectExample,
	ButtonExample,
	IconExample,
	DividerExample,
	AlertExample,
	CardExample,
	TagExample,
	BadgeExample,
	ProgressExample,
	SpinExample,
	EmptyExample,
	ResultExample,
};

// 包装组件示例的函数
export const wrapWithFormItem = (
	Component: React.ComponentType<any>,
	props?: any
) => {
	return (
		<Form>
			<FormItem id="example" label="示例">
				<Component {...props} />
			</FormItem>
		</Form>
	);
};

// 组件示例映射表
export const componentExamples: Record<string, React.ComponentType<any>> = {
	Input: InputExample,
	Select: SelectExample,
	Checkbox: CheckboxExample,
	CheckboxGroup: CheckboxGroupExample,
	Radio: RadioExample,
	RadioGroup: RadioGroupExample,
	TextArea: TextAreaExample,
	DatePicker: DatePickerExample,
	DateRangePicker: DateRangePickerExample,
	TimePicker: TimePickerExample,
	Container: ContainerExample,
	DynamicForm: DynamicFormExample,
	Tab: TabExample,
	Steps: StepsExample,
	Drawer: DrawerExample,
	Switch: SwitchExample,
	InputNumber: InputNumberExample,
	Slider: SliderExample,
	Rate: RateExample,
	AutoComplete: AutoCompleteExample,
	Cascader: CascaderExample,
	Transfer: TransferExample,
	TreeSelect: TreeSelectExample,
	Button: ButtonExample,
	Icon: IconExample,
	Divider: DividerExample,
	Alert: AlertExample,
	Card: CardExample,
	Tag: TagExample,
	Badge: BadgeExample,
	Progress: ProgressExample,
	Spin: SpinExample,
	Empty: EmptyExample,
	Result: ResultExample,
};

// 表单组件列表
export const formComponents = [
	'Input',
	'Select',
	'Checkbox',
	'CheckboxGroup',
	'Radio',
	'RadioGroup',
	'TextArea',
	'DatePicker',
	'DateRangePicker',
	'TimePicker',
	'DynamicForm',
	'Tab',
	'Steps',
	'Drawer',
	'Switch',
	'InputNumber',
	'Slider',
	'Rate',
	'AutoComplete',
	'Cascader',
	'Transfer',
	'TreeSelect',
	'Container',
];

// 非表单组件列表
export const nonFormComponents = [
	'Button',
	'Icon',
	'Divider',
	'Alert',
	'Card',
	'Tag',
	'Badge',
	'Progress',
	'Spin',
	'Empty',
	'Result',
];

// 获取组件示例
export const getComponentExample = (
	componentName: string
): React.ComponentType<any> | undefined => {
	return componentExamples[componentName];
};

// 检查是否为表单组件
export const isFormComponent = (componentName: string): boolean => {
	return formComponents.includes(componentName);
};
