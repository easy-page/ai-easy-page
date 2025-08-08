import {
	UserClientMessage,
	AssistantClientMessage,
	AssistantClientMessageToServer,
	ToolGroupClientMessage,
	UserShellClientMessage,
	ModelStatsClientMessage,
	AboutClientMessage,
	ErrorClientMessage,
	InfoClientMessage,
	ModelContentClientMessage,
	QuitClientMessage,
	StatsClientMessage,
	ToolStatsClientMessage,
} from './client';
import { ServerMessage, ServerRecommandMessage } from './server';

export type ConversationMessageType =
	| UserClientMessage
	| AssistantClientMessage
	| ServerMessage
	| ServerRecommandMessage
	| AssistantClientMessageToServer
	| UserShellClientMessage
	| ToolGroupClientMessage
	| QuitClientMessage
	| ModelStatsClientMessage
	| ToolStatsClientMessage
	| StatsClientMessage
	| AboutClientMessage
	| ErrorClientMessage
	| InfoClientMessage
	| ModelContentClientMessage;
