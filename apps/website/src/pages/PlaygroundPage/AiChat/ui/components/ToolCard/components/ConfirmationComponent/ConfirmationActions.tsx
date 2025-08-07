import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import {
	ToolCallConfirmationDetails,
	ToolConfirmationOutcome,
	ToolConfirmationPayload,
} from '../../../../../common/interfaces/serverChunk';
import { Icons } from '../../../../baseUi/components/icons';

interface ConfirmationActionsProps {
	confirmationDetails: ToolCallConfirmationDetails;
	onConfirm: (
		outcome: ToolConfirmationOutcome,
		payload?: ToolConfirmationPayload
	) => void;
}

export const ConfirmationActions: React.FC<ConfirmationActionsProps> = ({
	confirmationDetails,
	onConfirm,
}) => {
	return (
		<div className="mt-3 flex gap-2">
			<Button
				type="primary"
				size="small"
				onClick={() => onConfirm(ToolConfirmationOutcome.ProceedOnce)}
				icon={<Icons.Check className="w-3 h-3" />}
			>
				确认执行
			</Button>
			<Button
				size="small"
				onClick={() => onConfirm(ToolConfirmationOutcome.Cancel)}
				icon={<Icons.CrossL className="w-3 h-3" />}
			>
				取消
			</Button>
			{confirmationDetails.type === 'edit' && (
				<Button
					size="small"
					onClick={() => onConfirm(ToolConfirmationOutcome.ModifyWithEditor)}
					icon={<Icons.Pencil className="w-3 h-3" />}
				>
					编辑
				</Button>
			)}
		</div>
	);
};
