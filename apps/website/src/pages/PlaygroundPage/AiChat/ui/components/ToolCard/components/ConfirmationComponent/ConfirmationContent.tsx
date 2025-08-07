import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { ToolCallConfirmationDetails } from '@shared/serverChunk';
import { EditConfirmation } from './EditConfirmation';
import { ExecConfirmation } from './ExecConfirmation';
import { McpConfirmation } from './McpConfirmation';
import { InfoConfirmation } from './InfoConfirmation';

const { Text } = Typography;

interface ConfirmationContentProps {
	confirmationDetails: ToolCallConfirmationDetails;
}

export const ConfirmationContent: React.FC<ConfirmationContentProps> = ({
	confirmationDetails,
}) => {
	switch (confirmationDetails.type) {
		case 'edit':
			return <EditConfirmation details={confirmationDetails} />;
		case 'exec':
			return <ExecConfirmation details={confirmationDetails} />;
		case 'mcp':
			return <McpConfirmation details={confirmationDetails} />;
		case 'info':
			return <InfoConfirmation details={confirmationDetails} />;
		default:
			return (
				<Text className="text-orange-700 dark:text-orange-300">
					需要确认操作
				</Text>
			);
	}
};
