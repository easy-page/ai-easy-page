import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import { FieldValue } from '@easy-page/core';

const { Group: AntCheckboxGroup } = AntCheckbox;

export interface CheckboxOption {
	label: string;
	value: string | number;
	disabled?: boolean;
}

export interface CheckboxGroupProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	options?: CheckboxOption[];
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
	value,
	onChange,
	options = [],
	...props
}) => {
	const handleChange = (checkedValues: any[]) => {
		onChange?.(checkedValues);
	};

	return (
		<AntCheckboxGroup
			value={value as (string | number)[]}
			onChange={handleChange}
			options={options}
			{...props}
		/>
	);
};
