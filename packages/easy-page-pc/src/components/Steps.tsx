import React from 'react';
import { Steps, StepsProps as AntStepsProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface StepsProps extends Omit<AntStepsProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Steps: React.FC<StepsProps> = ({ value, onChange, ...props }) => {
	const handleChange = (current: number) => {
		onChange?.(current);
	};

	return <Steps current={value as number} onChange={handleChange} {...props} />;
};
