import React from 'react';
import { Radio as AntRadio } from 'antd';
import { FieldValue } from '@easy-page/core';

const { Group: AntRadioGroup } = AntRadio;

export interface RadioOption {
	label: string;
	value: string | number;
	disabled?: boolean;
}

export interface RadioGroupProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	options?: RadioOption[];
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
	value,
	onChange,
	options = [],
	...props
}) => {
	const handleChange = (e: any) => {
		onChange?.(e.target.value);
	};

	return (
		<AntRadioGroup
			value={value as string | number}
			onChange={handleChange}
			options={options}
			{...props}
		/>
	);
};
