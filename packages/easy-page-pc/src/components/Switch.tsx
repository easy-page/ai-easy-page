import React from 'react';
import { Switch as AntSwitch, SwitchProps as AntSwitchProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface SwitchProps
	extends Omit<AntSwitchProps, 'checked' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Switch: React.FC<SwitchProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (checked: boolean) => {
		onChange?.(checked);
	};

	return (
		<AntSwitch checked={value as boolean} onChange={handleChange} {...props} />
	);
};
