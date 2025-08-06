import React from 'react';

// FormItem 属性
export interface FormItemProps {
	label?: string;
	required?: boolean;
	validate?: any[];
	validateEffects?: any[];
	effects?: any[];
	actions?: any[];
	req?: any;
	extra?: React.ReactNode | ((params: any) => React.ReactNode);
	tips?: string;
	help?: string;
	labelLayout?: 'vertical' | 'horizontal';
	labelWidth?: number | string;
	noLabel?: boolean;
}
