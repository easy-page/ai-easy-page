import {
	FunctionProperty,
	ReactNodeProperty,
	FunctionReactNodeProperty,
} from '../specialProperties';

// 通用组件属性
export interface CommonComponentProps {
	placeholder?: string;
	disabled?: boolean;
	style?: Record<string, any>;
	className?: string;
}

// 选项类型
export interface OptionItem {
	label: string;
	value: string | number;
	disabled?: boolean;
}

// 基础属性
export const baseProps = {
	placeholder: '',
	disabled: false,
	style: {},
	className: '',
};
