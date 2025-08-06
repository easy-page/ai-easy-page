import React from 'react';
import {
	Cascader as AntCascader,
	CascaderProps as AntCascaderProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface CascaderProps
	extends Omit<AntCascaderProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Cascader: React.FC<CascaderProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: any) => {
		onChange?.(val);
	};

	return (
		<AntCascader value={value as any} onChange={handleChange} {...props} />
	);
};
