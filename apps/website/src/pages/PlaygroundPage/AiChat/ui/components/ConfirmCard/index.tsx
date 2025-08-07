import React from 'react';
import { Card, Typography, Button, Space } from '@douyinfe/semi-ui';
import { Icons } from '../../baseUi/components/icons';

const { Text } = Typography;

export interface ConfirmCardProps {
	id: string;
	messageId: string;
	conversationId: string;
	detail: {
		request?: {
			callId: string;
			name: string;
			args: Record<string, unknown>;
			isClientInitiated: boolean;
			prompt_id: string;
		};
		confirmationDetails?: {
			description: string;
			requiresConfirmation: boolean;
		};
	};
}

export const ConfirmCard: React.FC<ConfirmCardProps> = ({ id, detail }) => {
	const handleConfirm = () => {
		// TODO: 实现确认逻辑
		console.log('确认工具调用:', id);
	};

	const handleReject = () => {
		// TODO: 实现拒绝逻辑
		console.log('拒绝工具调用:', id);
	};

	return (
		<Card
			className="mb-3 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
			bodyStyle={{ padding: '12px 16px' }}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-1">
					<Icons.QuestionMarkCircled className="text-yellow-500 w-4 h-4" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<Text strong className="text-yellow-700 dark:text-yellow-300">
							需要确认
						</Text>
					</div>

					{detail.request?.name && (
						<Text strong className="block mb-2 text-foreground-primary">
							工具: {detail.request.name}
						</Text>
					)}

					{detail.confirmationDetails?.description && (
						<div className="mb-3">
							<Text className="text-foreground-secondary text-sm leading-relaxed">
								{detail.confirmationDetails.description}
							</Text>
						</div>
					)}

					{detail.request?.args &&
						Object.keys(detail.request.args).length > 0 && (
							<div className="mb-3">
								<Text className="text-foreground-secondary text-xs mb-1 block">
									参数:
								</Text>
								<pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
									{JSON.stringify(detail.request.args, null, 2)}
								</pre>
							</div>
						)}

					<Space>
						<Button
							type="primary"
							size="small"
							onClick={handleConfirm}
							icon={<Icons.Check className="w-3 h-3" />}
						>
							确认执行
						</Button>
						<Button
							size="small"
							onClick={handleReject}
							icon={<Icons.CrossL className="w-3 h-3" />}
						>
							拒绝
						</Button>
					</Space>
				</div>
			</div>
		</Card>
	);
};
