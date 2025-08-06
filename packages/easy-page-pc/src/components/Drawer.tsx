import React from 'react';
import { Drawer as AntDrawer, DrawerProps as AntDrawerProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface DrawerProps extends Omit<AntDrawerProps, 'open' | 'onClose'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
	value,
	onChange,
	...props
}) => {
	const handleClose = () => {
		onChange?.(false);
	};

	return <AntDrawer open={value as boolean} onClose={handleClose} {...props} />;
};
