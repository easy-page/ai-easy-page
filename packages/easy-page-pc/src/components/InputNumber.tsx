import React from 'react';
import {
	InputNumber as AntInputNumber,
	InputNumberProps as AntInputNumberProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface InputNumberProps
	extends Omit<AntInputNumberProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const InputNumber: React.FC<InputNumberProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: number | null) => {
		onChange?.(val);
	};

	return (
		<AntInputNumber
			value={value as number}
			onChange={handleChange}
			{...props}
		/>
	);
};
