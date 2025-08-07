import { generateCardId } from '..';
import { getCardComponent } from './getCardComponent';
import {
	ServerMsgType,
	ChatMessageRole,
	ClientMessageFrom,
	ServerMessageCardType,
} from '../../../common/constants/message';
import { ServerMessage } from '../../../common/interfaces/messages/chatMessages/server';
import {
	ServerStreamEvent,
	TurnEventType,
} from '../../../common/interfaces/serverChunk';

export const getServerMessageFromChunk = ({
	chunk,
	conversationId,
	messageId,
	venueId,
}: {
	chunk: ServerStreamEvent;
	conversationId: string;
	messageId: string;
	venueId: number;
}): ServerMessage => {
	const serverMessage: ServerMessage = {
		id: messageId || '',
		conversation_id: conversationId || '',
		type: ServerMsgType.NORMAL,
		role: ChatMessageRole.ASSISTANT,
		overrideContent: false,
		content: '',
		venue_id: venueId,
		msg_from: ClientMessageFrom.SERVER,
	};
	if (chunk.type === TurnEventType.Content) {
		serverMessage.content += chunk.value;
	}
	if (chunk.type === TurnEventType.Thought) {
		const cardId = generateCardId('thought');
		serverMessage.content += getCardComponent({
			chunkId: cardId,
			messageId,
			conversationId,
		});
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[cardId]: {
				type: ServerMessageCardType.ThoughtCard,
				id: cardId,
				detail: chunk.value,
			},
		};
	}

	if (chunk.type === TurnEventType.ToolCallRequest) {
		const callId = chunk.value.callId;
		serverMessage.content += getCardComponent({
			chunkId: callId,
			messageId,
			conversationId,
		});
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[callId]: {
				type: ServerMessageCardType.ToolCard,
				id: callId,
				detail: {
					request: chunk.value,
					startTime: Date.now(),
				},
			},
		};
		console.log('serverMessageserverMessage: =》', serverMessage);
	}

	if (chunk.type === TurnEventType.ToolCallResponse) {
		const callId = chunk.value.callId;
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[callId]: {
				type: ServerMessageCardType.ToolCard,
				id: callId,
				detail: {
					response: chunk.value,
					endTime: Date.now(),
				},
			},
		};
		console.log('serverMessageserverMessage:', serverMessage);
	}

	if (chunk.type === TurnEventType.ToolCallOutput) {
		const callId = chunk.value.toolCallId;
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[callId]: {
				type: ServerMessageCardType.ToolCard,
				id: callId,
				detail: {
					output: chunk.value,
				},
			},
		};
	}

	if (chunk.type === TurnEventType.ToolCallUpdate) {
		chunk.value.forEach((toolCall) => {
			const callId = toolCall.request.callId;
			serverMessage.cards = {
				...(serverMessage.cards || {}),
				[callId]: {
					type: ServerMessageCardType.ToolCard,
					id: callId,
					detail: {
						update: toolCall,
					},
				},
			};
		});
	}

	if (chunk.type === TurnEventType.ToolCallComplete) {
		chunk.value.forEach((toolCall) => {
			const callId = toolCall.request.callId;
			serverMessage.cards = {
				...(serverMessage.cards || {}),
				[callId]: {
					type: ServerMessageCardType.ToolCard,
					id: callId,
					detail: {
						complete: toolCall,
					},
				},
			};
		});
	}

	if (chunk.type === TurnEventType.ToolCallConfirmation) {
		const callId = chunk.value.request.callId;
		serverMessage.content += getCardComponent({
			chunkId: callId,
			messageId,
			conversationId,
		});
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[callId]: {
				type: ServerMessageCardType.ConfirmCard,
				id: callId,
				detail: chunk.value,
			},
		};
	}

	if (chunk.type === TurnEventType.UserCancelled) {
		const cardId = generateCardId('cancel');
		serverMessage.content += getCardComponent({
			chunkId: cardId,
			messageId,
			conversationId,
		});
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[cardId]: {
				type: ServerMessageCardType.ConfirmCard,
				id: cardId,
				detail: {},
			},
		};
	}

	if (chunk.type === TurnEventType.Error) {
		const cardId = generateCardId('error');
		serverMessage.content += getCardComponent({
			chunkId: cardId,
			messageId,
			conversationId,
		});
		serverMessage.cards = {
			...(serverMessage.cards || {}),
			[cardId]: {
				type: ServerMessageCardType.ErrorCard,
				id: cardId,
				detail: chunk.value,
			},
		};
	}

	return serverMessage;
};
