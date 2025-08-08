import { ServerMessageChunk } from '../../../common/interfaces/messages/stream';
import {
	ServerStreamEvent,
	TurnEventType,
} from '../../../common/interfaces/serverChunk';
import { convertServerMsgToFrontChunk } from './convertServerMsgToFrontChunk';
import { unRegisterHandlers } from './unRegisterHandlers';

export const doHandleStreamMsg =
	({
		savedConversationId,
		savedAssistantMsgId,
		conversationId,
		messageId,
		updateComplated,
		getCurrentResolve,
		getCurrentReject,
		clearCurrentResolve,
		addQueue,
		addPendingToolCalls,
		venueId,
	}: {
		savedConversationId: string;
		savedAssistantMsgId: string;
		conversationId: string;
		messageId: string;
		updateComplated: () => void;
		getCurrentResolve: () => ((value: ServerMessageChunk) => void) | null;
		getCurrentReject: () => ((error: Error) => void) | null;
		clearCurrentResolve: () => void;
		addQueue: (chunk: ServerMessageChunk) => void;
		addPendingToolCalls: (id: string) => void;
		venueId: number;
	}) =>
	(data: ServerStreamEvent) => {
		const chunk = convertServerMsgToFrontChunk({
			chunk: data,
			conversationId: savedConversationId,
			messageId: savedAssistantMsgId,
			originalConversationId: conversationId,
			originalMessageId: messageId,
			venueId,
		});

		console.log('stream msg chunk:', chunk);

		if (data.type === TurnEventType.ToolCallRequest) {
			addPendingToolCalls(data.value.callId);
		}

		// 检查是否是结束事件
		if (
			data.type === TurnEventType.UserCancelled ||
			data.type === TurnEventType.Error
		) {
			updateComplated();
			// 清理事件处理器
			unRegisterHandlers();
		}

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
