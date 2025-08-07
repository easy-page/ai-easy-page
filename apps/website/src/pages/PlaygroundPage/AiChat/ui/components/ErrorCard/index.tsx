import React from 'react';
import { Card, Typography, Button } from '@douyinfe/semi-ui';
import { Icons } from '../../baseUi/components/icons';

const { Text } = Typography;

export interface ErrorCardProps {
	id: string;
	messageId: string;
	conversationId: string;
	detail: {
		error?: {
			message: string;
			status?: number;
		};
	};
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ id, detail }) => {
	const handleRetry = () => {
		// TODO: 实现重试逻辑
		console.log('重试操作:', id);
	};

	return (
		<Card
			className="mb-3 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20"
			bodyStyle={{ padding: '12px 16px' }}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-1">
					<Icons.ExclamationTriangle className="text-red-500 w-4 h-4" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							<Text strong className="text-red-700 dark:text-red-300">
								发生错误
							</Text>
						</div>
						{detail.error?.status && (
							<Text className="text-red-600 text-xs">
								状态码: {detail.error.status}
							</Text>
						)}
					</div>

					{detail.error?.message && (
						<div className="mb-3">
							<Text className="text-foreground-secondary text-sm leading-relaxed">
								{detail.error.message}
							</Text>
						</div>
					)}

					<Button
						type="primary"
						size="small"
						onClick={handleRetry}
						icon={<Icons.Reload className="w-3 h-3" />}
					>
						重试
					</Button>
				</div>
			</div>
		</Card>
	);
};
