import React from 'react';
import { Rate as AntRate, RateProps as AntRateProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface RateProps extends Omit<AntRateProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Rate: React.FC<RateProps> = ({ value, onChange, ...props }) => {
	const handleChange = (val: number) => {
		onChange?.(val);
	};

	return <AntRate value={value as number} onChange={handleChange} {...props} />;
};
