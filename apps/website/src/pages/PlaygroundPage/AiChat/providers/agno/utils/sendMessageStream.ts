import { renderApi } from '../../../renderApis';
import { unRegisterHandlers } from './unRegisterHandlers';
import { PartListUnion } from '../../../common/interfaces/message';

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
	queryToSend?: PartListUnion | null;
	onComplete: () => void;
	onError: (error: Error) => void;
	venueId: number;
}) => {
	if (!queryToSend) {
		onComplete();
		return;
	}
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
