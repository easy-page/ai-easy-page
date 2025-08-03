import React from 'react';
import {
	Input as MobileInput,
	InputProps as MobileInputProps,
} from 'antd-mobile';
import { FieldValue } from '@easy-page/core';

export interface InputProps
	extends Omit<MobileInputProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Input: React.FC<InputProps> = ({ value, onChange, ...props }) => {
	const handleChange = (val: string) => {
		onChange?.(val);
	};

	return (
		<MobileInput value={value as string} onChange={handleChange} {...props} />
	);
};
