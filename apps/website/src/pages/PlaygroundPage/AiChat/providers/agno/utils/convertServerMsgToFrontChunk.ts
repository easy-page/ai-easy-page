import { ServerMessageChunk } from '../../../common/interfaces/messages/stream';
import { ServerStreamEvent } from '../../../common/interfaces/serverChunk';
import { getServerMessageFromChunk } from './getServerMessageFromChunk';

export const convertServerMsgToFrontChunk = ({
	chunk,
	conversationId,
	messageId,
	originalConversationId,
	originalMessageId,
	venueId,
}: {
	chunk: ServerStreamEvent;
	conversationId: string;
	messageId: string;
	originalMessageId: string;
	originalConversationId: string;
	venueId: number;
}): ServerMessageChunk => {
	return {
		messageId: messageId,
		originalMessageId: originalMessageId,
		conversationId: conversationId,
		originalConversationId: originalConversationId,
		serverMessage: getServerMessageFromChunk({
			chunk,
			conversationId,
			messageId,
			venueId,
		}),
	};
};
