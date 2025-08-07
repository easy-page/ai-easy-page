import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { ToolExecuteConfirmationDetails } from '@shared/serverChunk';

const { Text } = Typography;

interface ExecConfirmationProps {
	details: ToolExecuteConfirmationDetails;
}

export const ExecConfirmation: React.FC<ExecConfirmationProps> = ({
	details,
}) => {
	return (
		<div className="space-y-3">
			<Text strong className="text-orange-700 dark:text-orange-300">
				{details.title}
			</Text>
			<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
				<Text className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
					命令:
				</Text>
				<pre className="text-xs font-mono overflow-x-auto">
					{details.command}
				</pre>
			</div>
		</div>
	);
};
