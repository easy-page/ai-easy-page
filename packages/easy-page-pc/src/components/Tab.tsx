import React from 'react';
import { Tabs, TabsProps as AntTabsProps } from 'antd';
import { FieldValue } from '@easy-page/core';

export interface TabProps extends Omit<AntTabsProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
}

export const Tab: React.FC<TabProps> = ({ value, onChange, ...props }) => {
	const handleChange = (activeKey: string) => {
		onChange?.(activeKey);
	};

	return (
		<Tabs activeKey={value as string} onChange={handleChange} {...props} />
	);
};
