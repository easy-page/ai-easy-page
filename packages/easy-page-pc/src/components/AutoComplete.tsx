import React from 'react';
import {
	AutoComplete as AntAutoComplete,
	AutoCompleteProps as AntAutoCompleteProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface AutoCompleteProps
	extends Omit<AntAutoCompleteProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: string) => {
		onChange?.(val);
	};

	return (
		<AntAutoComplete
			value={value as string}
			onChange={handleChange}
			{...props}
		/>
	);
};
