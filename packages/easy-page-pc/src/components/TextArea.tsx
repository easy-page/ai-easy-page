import React from 'react';
import { Input } from 'antd';
import { FieldValue } from '@easy-page/core';

const { TextArea: AntTextArea } = Input;

export interface TextAreaProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	placeholder?: string;
	disabled?: boolean;
	rows?: number;
	showCount?: boolean;
	maxLength?: number;
	autoSize?: boolean | { minRows?: number; maxRows?: number };
	style?: React.CSSProperties;
	className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
	value,
	onChange,
	rows = 4,
	showCount = false,
	maxLength,
	autoSize,
	...props
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<AntTextArea
			value={value as string}
			onChange={handleChange}
			rows={rows}
			showCount={showCount}
			maxLength={maxLength}
			autoSize={autoSize}
			{...props}
		/>
	);
};
