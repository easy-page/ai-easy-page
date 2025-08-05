import InputConfigPanel from './InputConfigPanel';
import SelectConfigPanel from './SelectConfigPanel';
import TextAreaConfigPanel from './TextAreaConfigPanel';
import DatePickerConfigPanel from './DatePickerConfigPanel';
import DateRangePickerConfigPanel from './DateRangePickerConfigPanel';
import TimePickerConfigPanel from './TimePickerConfigPanel';
import CheckboxConfigPanel from './CheckboxConfigPanel';
import CheckboxGroupConfigPanel from './CheckboxGroupConfigPanel';
import RadioConfigPanel from './RadioConfigPanel';
import RadioGroupConfigPanel from './RadioGroupConfigPanel';
import ContainerConfigPanel from './ContainerConfigPanel';
import DynamicFormConfigPanel from './DynamicFormConfigPanel';
import CustomConfigPanel from './CustomConfigPanel';
import FormItemConfigPanel from './FormItemConfigPanel';
import FormConfigPanel from './FormConfigPanel';

// 组件配置面板映射
export const ComponentConfigPanelMap = {
	Input: InputConfigPanel,
	Select: SelectConfigPanel,
	TextArea: TextAreaConfigPanel,
	DatePicker: DatePickerConfigPanel,
	DateRangePicker: DateRangePickerConfigPanel,
	TimePicker: TimePickerConfigPanel,
	Checkbox: CheckboxConfigPanel,
	CheckboxGroup: CheckboxGroupConfigPanel,
	Radio: RadioConfigPanel,
	RadioGroup: RadioGroupConfigPanel,
	Container: ContainerConfigPanel,
	DynamicForm: DynamicFormConfigPanel,
	Custom: CustomConfigPanel,
};

// 导出所有配置面板
export {
	InputConfigPanel,
	SelectConfigPanel,
	TextAreaConfigPanel,
	DatePickerConfigPanel,
	DateRangePickerConfigPanel,
	TimePickerConfigPanel,
	CheckboxConfigPanel,
	CheckboxGroupConfigPanel,
	RadioConfigPanel,
	RadioGroupConfigPanel,
	ContainerConfigPanel,
	DynamicFormConfigPanel,
	CustomConfigPanel,
	FormItemConfigPanel,
	FormConfigPanel,
};
