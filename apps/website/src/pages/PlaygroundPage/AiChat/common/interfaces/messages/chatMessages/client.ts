import {
	ChatMessageRole,
	ClientMessageFrom,
	ServerMessageType,
} from '../../../constants/message';
import { ChatMessageContext } from './context';
import { BaseChatMessage } from './common';
import { ServerMessage } from './server';
import {
	ToolCallConfirmationDetails,
	ToolResultDisplay,
} from '../../serverChunk';

// 业务线、token、env 环境、用户信息

export interface UserClientMessage extends BaseChatMessage {
	role: ChatMessageRole.USER;
	content: string;
	context?: ChatMessageContext[];
	msg_from: ClientMessageFrom.CLIENT;
}

/** Agent 给会话里发送的消息类型 */
export interface AssistantClientMessage extends BaseChatMessage {
	role: ChatMessageRole.ASSISTANT;
	content: string;
	context?: ChatMessageContext[];
	msg_from: ClientMessageFrom.CLIENT;
}

// 存储到服务器的消息类型
export interface AssistantClientMessageToServer extends ServerMessage {
	role: ChatMessageRole.ASSISTANT;
	content: string;
	msg_from: ClientMessageFrom.SERVER;
}

export interface UserShellClientMessage extends BaseChatMessage {
	role: ChatMessageRole.USER_SHELL;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export enum ToolCallStatus {
	Pending = 'Pending',
	Canceled = 'Canceled',
	Confirming = 'Confirming',
	Executing = 'Executing',
	Success = 'Success',
	Error = 'Error',
}

export interface IndividualToolCallDisplay {
	callId: string;
	name: string;
	description: string;
	resultDisplay: ToolResultDisplay | undefined;
	status: ToolCallStatus;
	confirmationDetails: ToolCallConfirmationDetails | undefined;
	renderOutputAsMarkdown?: boolean;
}
export interface ToolGroupClientMessage extends BaseChatMessage {
	role: ChatMessageRole.TOOL_GROUP;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
	tools: IndividualToolCallDisplay[];
}

export interface QuitClientMessage extends BaseChatMessage {
	role: ChatMessageRole.QUIT;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
	duration: string;
}

export interface ModelStatsClientMessage extends BaseChatMessage {
	role: ChatMessageRole.MODEL_STATS;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface ToolStatsClientMessage extends BaseChatMessage {
	role: ChatMessageRole.TOOL_STATS;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface StatsClientMessage extends BaseChatMessage {
	role: ChatMessageRole.STATS;
	content?: string;
	duration: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface AboutClientMessage extends BaseChatMessage {
	role: ChatMessageRole.ABOUT;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface ErrorClientMessage extends BaseChatMessage {
	role: ChatMessageRole.ERROR;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface InfoClientMessage extends BaseChatMessage {
	role: ChatMessageRole.INFO;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}

export interface ModelContentClientMessage extends BaseChatMessage {
	role: ChatMessageRole.MODEL_CONTENT;
	content: string;
	msg_from: ClientMessageFrom.CLIENT;
}
