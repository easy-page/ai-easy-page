import { renderApi } from '@/renderApis';
import {
	ChatMessageRole,
	ClientMessageFrom,
	ServerMsgType,
} from '@/common/constants/message';
import { ServerMessageChunk } from '@/common/interfaces/messages/stream';
import { unRegisterHandlers } from './unRegisterHandlers';
import { PartListUnion } from '@shared/message';

export const sendMessageStreamWithHandlers = ({
	savedConversationId,
	queryToSend,
	savedAssistantMsgId,
	onComplete,
	onError,
	venueId,
}: {
	savedAssistantMsgId: string;
	savedConversationId: string;
	queryToSend: PartListUnion;
	onComplete: () => void;
	onError: (error: Error) => void;
	venueId: number;
}) => {
	return renderApi
		.sendMessageStream({
			message: queryToSend,
			promptId: savedAssistantMsgId,
			conversationId: savedConversationId,
			venueId,
		})
		.then((response) => {
			if (response && response.success) {
				console.log('消息流处理完成:', new Date().getTime());
			}
			onComplete();
		})
		.catch((error) => {
			console.log('【工具调用】error:', error);
			onError(error);
			// 清理事件处理器
			unRegisterHandlers();
		});
};
