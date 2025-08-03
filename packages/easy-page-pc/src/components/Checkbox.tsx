import React from 'react';
import {
	Checkbox as AntCheckbox,
	CheckboxProps as AntCheckboxProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface CheckboxProps
	extends Omit<AntCheckboxProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (e: any) => {
		onChange?.(e.target.checked);
	};

	return (
		<AntCheckbox
			checked={value as boolean}
			onChange={handleChange}
			{...props}
		/>
	);
};
