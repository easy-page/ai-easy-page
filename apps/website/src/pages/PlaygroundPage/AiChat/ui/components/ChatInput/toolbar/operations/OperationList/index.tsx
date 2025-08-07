import { ChatMode, SenceOperationEnum } from '@/common/constants/scence';
import { SenceInputComponentOperation } from '@/common/interfaces';
import { DialogInput } from '../../../sences/operations/DialogInput';
import { DownloadFileOperation } from '../../../sences/operations/DownloadFile';
import { UploadFileOperation } from '../../../sences/operations/UploadFile';
import { useMemo } from 'react';
import { Dropdown } from '@douyinfe/semi-ui';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import classNames from 'classnames';
import { MoreSkillsIcon } from '@/views/aiChat/components/Icons';
import { ChatService } from '@/services/chatGlobalState';

export type OperationListProps = {
	chatMode: ChatMode;
	operations: SenceInputComponentOperation[];
};

const OperationItem: Partial<
	Record<
		SenceOperationEnum,
		React.FC<{
			onChange: (val: string) => void;
			operation: SenceInputComponentOperation;
		}>
	>
> = {
	[SenceOperationEnum.DialogInput]: ({ onChange, operation }) => (
		<DialogInput
			onChange={onChange}
			{...(operation.dialogInputConfig || ({} as any))}
		/>
	),
	[SenceOperationEnum.UploadFile]: ({ onChange, operation }) => (
		<UploadFileOperation onChange={onChange} operation={operation} />
	),

	[SenceOperationEnum.DownloadFile]: ({ onChange, operation }) => (
		<DownloadFileOperation onChange={onChange} operation={operation} />
	),
};

export const OperationList = ({ chatMode, operations }: OperationListProps) => {
	const chatService = useService(ChatService);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);
	const isNewChat = chatMode === ChatMode.NewChat;
	const operationsBtn = useMemo(() => {
		return operations.map((operation, idx) => {
			if (operation.scence && !operation.scence.includes(chatMode)) {
				return <></>;
			}
			const Operation = OperationItem[operation.type];
			console.log('operation1111operation:', operation);
			return Operation ? (
				<Operation
					key={operation.label}
					onChange={() => {}}
					operation={operation}
				/>
			) : (
				<></>
			);
		});
	}, [operations]);
	if (isNewChat) {
		return operationsBtn;
	}

	const isDisabled = isWaiting;
	return (
		<Dropdown
			trigger="click"
			position="topLeft"
			clickToHide
			disabled={isDisabled}
			render={
				!isDisabled ? (
					<Dropdown.Menu>
						{operations.map((operation) => {
							if (operation.scence && !operation.scence.includes(chatMode)) {
								return <></>;
							}
							const Operation = OperationItem[operation.type];
							return (
								<Dropdown.Item
									key={String(operation.label)}
									onClick={(e) => {}}
								>
									{Operation && (
										<Operation
											key={operation.label}
											onChange={() => {}}
											operation={operation}
										/>
									)}
								</Dropdown.Item>
							);
						})}
					</Dropdown.Menu>
				) : null
			}
		>
			<div
				onClick={(e) => {
					if (isDisabled) {
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}}
				className={classNames(
					'rounded-[10px] hover:bg-background-secondary  p-2 border border-md border-[#EBEBEB]',
					{
						'opacity-50 cursor-not-allowed': isDisabled,
						'cursor-pointer ': !isDisabled,
					}
				)}
			>
				<div className="flex flex-row items-center px-2 ">
					<MoreSkillsIcon />
					<div className="ml-2 text-small">操作</div>
				</div>
			</div>
		</Dropdown>
	);
};
