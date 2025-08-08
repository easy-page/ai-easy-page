import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { ToolInfoConfirmationDetails } from '@shared/serverChunk';

const { Text } = Typography;

interface InfoConfirmationProps {
	details: ToolInfoConfirmationDetails;
}

export const InfoConfirmation: React.FC<InfoConfirmationProps> = ({
	details,
}) => {
	return (
		<div className="space-y-3">
			<Text strong className="text-orange-700 dark:text-orange-300">
				{details.title}
			</Text>
			<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
				<Text className="text-xs text-gray-600 dark:text-gray-400">
					{details.prompt}
				</Text>
				{details.urls && details.urls.length > 0 && (
					<div className="mt-2">
						<Text className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
							相关链接:
						</Text>
						{details.urls.map((url, index) => (
							<a
								key={index}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs text-blue-600 hover:text-blue-800 block"
							>
								{url}
							</a>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
