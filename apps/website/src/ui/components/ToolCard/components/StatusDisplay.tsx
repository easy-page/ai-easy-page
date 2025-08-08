import React from 'react';
import { Tag, Spin } from '@douyinfe/semi-ui';
import { Icons } from '../../../baseUi/components/icons';

export interface StatusDisplayConfig {
	tag: React.ReactNode;
	icon: React.ReactNode;
	borderColor: string;
	bgColor: string;
	textColor: string;
}

export const getStatusDisplay = (status: string): StatusDisplayConfig => {
	switch (status) {
		case 'cancelled':
			return {
				tag: <Tag color="grey">已取消</Tag>,
				icon: <Icons.CancelIcon className="text-gray-500 w-4 h-4" />,
				borderColor: 'border-l-gray-500',
				bgColor: 'bg-gray-50 dark:bg-gray-900/20',
				textColor: 'text-gray-600 dark:text-gray-400',
			};
		case 'error':
			return {
				tag: <Tag color="red">执行失败</Tag>,
				icon: <Icons.ExclamationTriangle className="text-red-500 w-4 h-4" />,
				borderColor: 'border-l-red-500',
				bgColor: 'bg-red-50 dark:bg-red-900/20',
				textColor: 'text-red-600 dark:text-red-400',
			};
		case 'executing':
			return {
				tag: (
					<div className="flex items-center gap-1">
						<Spin size="small" />
						<Tag color="blue">执行中</Tag>
					</div>
				),
				icon: <Icons.Reload className="text-blue-500 w-4 h-4 animate-spin" />,
				borderColor: 'border-l-blue-500',
				bgColor: 'bg-blue-50 dark:bg-blue-900/20',
				textColor: 'text-blue-600 dark:text-blue-400',
			};
		case 'success':
			return {
				tag: <Tag color="green">执行成功</Tag>,
				icon: <Icons.Check className="text-green-500 w-4 h-4" />,
				borderColor: 'border-l-green-500',
				bgColor: 'bg-green-50 dark:bg-green-900/20',
				textColor: 'text-green-600 dark:text-green-400',
			};
		case 'awaiting_approval':
			return {
				tag: <Tag color="orange">等待确认</Tag>,
				icon: <Icons.QuestionMarkCircled className="text-orange-500 w-4 h-4" />,
				borderColor: 'border-l-orange-500',
				bgColor: 'bg-orange-50 dark:bg-orange-900/20',
				textColor: 'text-orange-600 dark:text-orange-400',
			};
		case 'confirmed':
			return {
				tag: <Tag color="green">已经确认</Tag>,
				icon: <Icons.Check className="text-green-500 w-4 h-4" />,
				borderColor: 'border-l-green-500',
				bgColor: 'bg-green-50 dark:bg-green-900/20',
				textColor: 'text-green-600 dark:text-green-400',
			};
		default:
			return {
				tag: <Tag color="grey">等待中</Tag>,
				icon: <Icons.ClockIcon className="text-gray-400 w-4 h-4" />,
				borderColor: 'border-l-gray-400',
				bgColor: 'bg-gray-50 dark:bg-gray-900/20',
				textColor: 'text-gray-600 dark:text-gray-400',
			};
	}
};
