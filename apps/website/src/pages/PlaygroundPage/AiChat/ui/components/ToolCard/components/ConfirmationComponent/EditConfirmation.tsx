import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { ToolEditConfirmationDetails } from '@shared/serverChunk';

const { Text } = Typography;

interface EditConfirmationProps {
	details: ToolEditConfirmationDetails;
}

export const EditConfirmation: React.FC<EditConfirmationProps> = ({
	details,
}) => {
	return (
		<div className="space-y-3">
			<Text strong className="text-orange-700 dark:text-orange-300">
				{details.title}
			</Text>
			<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
				<Text className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
					文件: {details.fileName}
				</Text>
				<pre className="text-xs overflow-x-auto max-h-32 overflow-y-auto whitespace-pre-wrap">
					{details.fileDiff}
				</pre>
			</div>
		</div>
	);
};
