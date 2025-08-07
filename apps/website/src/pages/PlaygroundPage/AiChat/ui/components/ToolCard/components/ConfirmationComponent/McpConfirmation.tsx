import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { ToolMcpConfirmationDetails } from '@shared/serverChunk';

const { Text } = Typography;

interface McpConfirmationProps {
	details: ToolMcpConfirmationDetails;
}

export const McpConfirmation: React.FC<McpConfirmationProps> = ({
	details,
}) => {
	return (
		<div className="space-y-3">
			<Text strong className="text-orange-700 dark:text-orange-300">
				{details.title}
			</Text>
			<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
				<Text className="text-xs text-gray-600 dark:text-gray-400">
					MCP服务器: {details.serverName}
				</Text>
				<Text className="text-xs text-gray-600 dark:text-gray-400">
					工具: {details.toolDisplayName}
				</Text>
			</div>
		</div>
	);
};
