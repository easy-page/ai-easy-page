import React from 'react';
import {
	Transfer as AntTransfer,
	TransferProps as AntTransferProps,
} from 'antd';
import { FieldValue } from '@easy-page/core';

export interface TransferProps
	extends Omit<AntTransferProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Transfer: React.FC<TransferProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleChange = (val: string[]) => {
		onChange?.(val);
	};

	return (
		<AntTransfer
			selectedKeys={value as string[]}
			onChange={handleChange}
			{...props}
		/>
	);
};
