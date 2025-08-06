import React from 'react';
import {
	TreeSelect as AntTreeSelect,
	TreeSelectProps as AntTreeSelectProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface TreeSelectProps
	extends Omit<AntTreeSelectProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: any) => {
		onChange?.(val);
	};

	return (
		<AntTreeSelect value={value as any} onChange={handleChange} {...props} />
	);
};
