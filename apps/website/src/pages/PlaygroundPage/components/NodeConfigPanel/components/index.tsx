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
import DivConfigPanel from './DivConfigPanel';
import SpanConfigPanel from './SpanConfigPanel';
import PConfigPanel from './PConfigPanel';
import AConfigPanel from './AConfigPanel';
import UlConfigPanel from './UlConfigPanel';
import LiConfigPanel from './LiConfigPanel';
import CanvasConfigPanel from './CanvasConfigPanel';
import IframeConfigPanel from './IframeConfigPanel';
import DynamicFormConfigPanel from './DynamicFormConfigPanel';
import CustomConfigPanel from './CustomConfigPanel';
import TextConfigPanel from './TextConfigPanel';
import FormItemConfigPanel from './FormItemConfigPanel';
import FormConfigPanel from './FormConfigPanel';
import ReactNodeConfigPanel from './ReactNodeConfigPanel';
import FunctionPropertyConfigPanel from './FunctionPropertyConfigPanel';
import FunctionReactNodePropertyConfigPanel from './FunctionReactNodePropertyConfigPanel';
import ReactNodeArrayConfigPanel from './ReactNodeArrayConfigPanel';
import NodeSelectorModal from './NodeSelectorModal';

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
	OnlyText: TextConfigPanel,
	// 原生 HTML 元素：按元素拆分面板
	div: DivConfigPanel,
	span: SpanConfigPanel,
	p: PConfigPanel,
	a: AConfigPanel,
	ul: UlConfigPanel,
	li: LiConfigPanel,
	canvas: CanvasConfigPanel,
	iframe: IframeConfigPanel,
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
	ReactNodeConfigPanel,
	FunctionPropertyConfigPanel,
	FunctionReactNodePropertyConfigPanel,
	ReactNodeArrayConfigPanel,
	NodeSelectorModal,
	TextConfigPanel,
};
