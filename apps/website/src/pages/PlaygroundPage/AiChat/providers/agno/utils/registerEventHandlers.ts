import { EVENT_NAME } from '../../../common/constants/constant';
import {
	ServerStreamEvent,
	FrontToolCall,
	FrontCompletedToolCall,
} from '../../../common/interfaces/serverChunk';
import { renderApi } from '../../../renderApis';
import { convertServerMsgToFrontChunk } from './convertServerMsgToFrontChunk';

export const registerEventHandlers = ({
	handleStreamMsg,
	handleToolCallOutput,
	handleToolCallUpdate,
	handleToolCallComplete,
}: {
	messageId: string;
	handleStreamMsg: (data: ServerStreamEvent) => void;
	handleToolCallOutput: (data: {
		toolCallId: string;
		outputChunk: string;
	}) => void;
	handleToolCallUpdate: (data: FrontToolCall[]) => void;
	handleToolCallComplete: (data: FrontCompletedToolCall[]) => void;
}) => {
	// 注册所有事件处理器
	renderApi.registerMessageHandler(EVENT_NAME.AiStreamMsg, handleStreamMsg);
	renderApi.registerMessageHandler(
		EVENT_NAME.AiToolCallOutput,
		handleToolCallOutput
	);
	renderApi.registerMessageHandler(
		EVENT_NAME.AiToolCallUpdate,
		handleToolCallUpdate
	);
	renderApi.registerMessageHandler(
		EVENT_NAME.AiToolCallComplete,
		handleToolCallComplete
	);
};
