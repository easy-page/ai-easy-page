import React from 'react';
import { Card, Typography } from '@douyinfe/semi-ui';
import { Icons } from '../../baseUi/components/icons';

const { Text } = Typography;

export interface ThoughtCardProps {
	id: string;
	messageId: string;
	conversationId: string;
	detail: {
		subject: string;
		description: string;
	};
}

export const ThoughtCard: React.FC<ThoughtCardProps> = ({ id, detail }) => {
	return (
		<Card
			className="mb-3 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
			bodyStyle={{ padding: '12px 16px' }}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-1">
					<Icons.MagicWand className="text-blue-500 w-4 h-4" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<Text strong className="text-blue-700 dark:text-blue-300">
							思考中
						</Text>
						<div className="flex space-x-1">
							<div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
							<div
								className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
								style={{ animationDelay: '0.2s' }}
							></div>
							<div
								className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
								style={{ animationDelay: '0.4s' }}
							></div>
						</div>
					</div>

					{detail.subject && (
						<Text strong className="block mb-1 text-foreground-primary">
							{detail.subject}
						</Text>
					)}

					{detail.description && (
						<Text className="text-foreground-secondary text-sm leading-relaxed">
							{detail.description}
						</Text>
					)}
				</div>
			</div>
		</Card>
	);
};
