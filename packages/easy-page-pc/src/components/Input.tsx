import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface InputProps extends Omit<AntInputProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Input: React.FC<InputProps> = ({ value, onChange, ...props }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<AntInput value={value as string} onChange={handleChange} {...props} />
	);
};
