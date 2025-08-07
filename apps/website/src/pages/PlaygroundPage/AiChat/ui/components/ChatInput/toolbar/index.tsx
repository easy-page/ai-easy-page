import { InputToolsEnum } from '../../../../common/constants/inputTools';
import {
	InputToolsConfig,
	SenceInput,
	SenceInputComponentOperation,
} from '../../../../common/interfaces';
import { useMemo } from 'react';
import { UploadFileBtn } from './operations/UploadFile';
import { UploadImageBtn } from './operations/UploadImage';
import { AudioInputBtn } from './operations/AudioInput';
import {
	ChatMode,
	SenceOperationEnum,
} from '../../../../common/constants/scence';
import { DialogInput } from '../sences/operations/DialogInput';

import { Line } from './Line';
import { SendBtn } from './operations/SendBtn';
import { UploadFileOperation } from '../sences/operations/UploadFile';
import { ReactEditor } from 'slate-react';
import { SenceConfig } from '../../../../common/interfaces/senceConfig';
import { InputToolConfig } from '../../../../common/interfaces/senceConfig/senceInput';
import { MoreSkillsBtn } from './operations/MoreSkillsBtn';
import { DownloadFileOperation } from '../sences/operations/DownloadFile';
export type ChatInputToolbarProps = {
	curSenceConfig?: SenceConfig | null;
	chatMode: ChatMode;
	editor: ReactEditor;
	onSend: () => void;
	extraTools?: InputToolsConfig;
};

const DEFAULT_TOOLBAR_OPERATIONS: InputToolsConfig = {
	left: [{ tool: InputToolsEnum.File }],
	// right: [{ tool: InputToolsEnum.Image, disabled: true }],
	right: [],
};

const InputToolItem: Record<
	InputToolsEnum,
	(tool: InputToolConfig) => React.ReactNode
> = {
	[InputToolsEnum.File]: (tool) => <UploadFileBtn disabled={tool.disabled} />,
	// [InputToolsEnum.Image]: (tool) => <UploadImageBtn disabled={tool.disabled} />,
	[InputToolsEnum.Audio]: (tool) => <AudioInputBtn disabled={tool.disabled} />,
	[InputToolsEnum.MoreSkills]: (tool) => (
		<MoreSkillsBtn disabled={tool.disabled} />
	),
};

// TODO 记得补充完整
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

export const ToolComponent = ({
	tool,
}: {
	tool: InputToolsEnum | InputToolConfig;
}) => {
	const curTool = typeof tool === 'string' ? { tool } : tool;
	const toolComponent = InputToolItem[curTool.tool];
	if (!toolComponent) {
		console.warn('toolComponent is not found: ', tool);
		return <></>;
	}
	return toolComponent(curTool);
};
export const ChatInputToolbar = ({
	curSenceConfig,
	chatMode,
	editor,
	onSend,
	extraTools,
}: ChatInputToolbarProps) => {
	const tools = useMemo(() => {
		const inputTools = curSenceConfig?.senceInput || ({} as SenceInput);
		if (inputTools.inputTools) {
			return inputTools.inputTools;
		}
		return DEFAULT_TOOLBAR_OPERATIONS;
	}, [curSenceConfig]);
	const operations = useMemo(() => {
		const inputOperations = curSenceConfig?.senceInput || ({} as SenceInput);
		if (inputOperations.operations) {
			return inputOperations.operations;
		}
		return [];
	}, [curSenceConfig]);
	return (
		<div className="flex flex-row items-center justify-between">
			<div className="flex flex-row gap-2 w-full">
				{operations.map((operation, idx) => {
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
				})}
				{[...tools.left, ...(extraTools?.left || [])].map((tool) => {
					const toolKey = typeof tool === 'string' ? tool : tool.tool;
					return <ToolComponent key={toolKey} tool={tool} />;
				})}
			</div>
			<div className="flex flex-row gap-2 items-center">
				{[...tools.right, ...(extraTools?.right || [])].map((tool) => {
					const toolKey = typeof tool === 'string' ? tool : tool.tool;
					return <ToolComponent key={toolKey} tool={tool} />;
				})}
				{tools.right.length > 0 && <Line />}
				<SendBtn
					onSend={onSend}
					chatMode={chatMode}
					editor={editor}
					disabledSend={false}
				/>
			</div>
		</div>
	);
};
