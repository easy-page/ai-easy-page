import { ServerMessageChunk } from '../../../common/interfaces/messages/stream';
import {
	TurnEventType,
	FrontToolCall,
} from '../../../common/interfaces/serverChunk';
import { convertServerMsgToFrontChunk } from './convertServerMsgToFrontChunk';

export const createToolCallHandlers = ({
	savedConversationId,
	savedAssistantMsgId,
	conversationId,
	messageId,
	getCurrentResolve,
	getCurrentReject,
	clearCurrentResolve,
	addQueue,
	removePendingToolCall,
	venueId,
}: {
	savedConversationId: string;
	savedAssistantMsgId: string;
	conversationId: string;
	messageId: string;
	getCurrentResolve: () => ((value: ServerMessageChunk) => void) | null;
	getCurrentReject: () => ((error: Error) => void) | null;
	clearCurrentResolve: () => void;
	addQueue: (chunk: ServerMessageChunk) => void;
	removePendingToolCall: (id: string) => void;
	venueId: number;
}) => {
	const handleToolCallOutput = (data: {
		toolCallId: string;
		outputChunk: string;
	}) => {
		console.log('【工具调用】收到工具调用输出:', data);

		// 创建工具输出卡片
		const chunk = convertServerMsgToFrontChunk({
			chunk: {
				type: TurnEventType.ToolCallOutput,
				value: data,
			},
			venueId,
			conversationId: savedConversationId,
			messageId: savedAssistantMsgId,
			originalConversationId: conversationId,
			originalMessageId: messageId,
		});

		// 如果有等待的 Promise，立即解析
		const currentResolve = getCurrentResolve();
		if (currentResolve) {
			currentResolve(chunk);
			clearCurrentResolve();
		} else {
			// 否则加入队列
			addQueue(chunk);
		}
	};

	const handleToolCallUpdate = (data: FrontToolCall[]) => {
		console.log('【工具调用】收到工具调用更新:', data);
		// 创建工具输出卡片
		const chunk = convertServerMsgToFrontChunk({
			chunk: {
				type: TurnEventType.ToolCallUpdate,
				value: data,
			},
			conversationId: savedConversationId,
			messageId: savedAssistantMsgId,
			originalConversationId: conversationId,
			originalMessageId: messageId,
			venueId,
		});

		// 如果有等待的 Promise，立即解析
		const currentResolve = getCurrentResolve();
		if (currentResolve) {
			currentResolve(chunk);
			clearCurrentResolve();
		} else {
			// 否则加入队列
			addQueue(chunk);
		}
		// 处理工具调用状态更新
		data.forEach((toolCall) => {
			if (
				toolCall.status === 'success' ||
				toolCall.status === 'error' ||
				toolCall.status === 'cancelled'
			) {
				// 从待处理列表中移除已完成的工具调用
				removePendingToolCall(toolCall.request.callId);
			}
		});
	};

	return {
		handleToolCallOutput,
		handleToolCallUpdate,
	};
};
