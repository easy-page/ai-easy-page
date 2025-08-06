import React from 'react';
import { Slider as AntSlider, SliderProps as AntSliderProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface SliderProps
	extends Omit<AntSliderProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Slider: React.FC<SliderProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: number | number[]) => {
		onChange?.(val);
	};

	return (
		<AntSlider
			value={value as number | number[]}
			onChange={handleChange}
			{...props}
		/>
	);
};
