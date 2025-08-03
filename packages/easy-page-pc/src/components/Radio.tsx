import React from 'react';
import { Radio as AntRadio, RadioProps as AntRadioProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface RadioProps extends Omit<AntRadioProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Radio: React.FC<RadioProps> = ({ value, onChange, ...props }) => {
	const handleChange = (e: any) => {
		onChange?.(e.target.value);
	};

	return (
		<AntRadio
			checked={value === (props as any).value}
			onChange={handleChange}
			{...props}
		/>
	);
};
