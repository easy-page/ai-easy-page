import React from 'react';
import {
	ToolCallConfirmationDetails,
	ToolConfirmationOutcome,
	ToolConfirmationPayload,
} from '@shared/serverChunk';
import { ConfirmationContent } from './ConfirmationContent';
import { ConfirmationActions } from './ConfirmationActions';

interface ConfirmationComponentProps {
	confirmationDetails: ToolCallConfirmationDetails;
	onConfirm: (
		outcome: ToolConfirmationOutcome,
		payload?: ToolConfirmationPayload
	) => void;
}

export const ConfirmationComponent: React.FC<ConfirmationComponentProps> = ({
	confirmationDetails,
	onConfirm,
}) => {
	return (
		<div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700">
			<ConfirmationContent confirmationDetails={confirmationDetails} />
			<ConfirmationActions
				confirmationDetails={confirmationDetails}
				onConfirm={onConfirm}
			/>
		</div>
	);
};
