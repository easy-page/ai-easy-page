import {
	ServerCardMessageType,
	ServerMessageCardType,
	ServerMessageType,
} from '../../constants/message';
import { SimpleTaskInfo } from '../task';
import { ServerMessage } from './chatMessages/server';

export type ApiStreamBaseChunk = {
	messageId?: string;
	originalMessageId?: string;
	conversationId?: string;
	originalConversationId?: string;
	overrideContent?: boolean;
	text: string;
};

/**
 * 这个是前端接收到服务端的：ApiStreamChunk 后拼装成前端消息的 ServerMessageChunk
 */
export type ServerMessageChunk = ApiStreamBaseChunk & {
	serverMessage: ServerMessage;
};
export type ApiStream = AsyncGenerator<ServerMessageChunk>;

/**
 * 下面是当前后端返回的 chunk，直接组装成 ServerMessage 即可
 * 后续扩展后端返回的 chunk 类型，在这里扩展
 */
export type ApiStreamChunk = ApiStreamCardChunk | ApiStreamTextChunk;

export type ApiStreamCardChunk = ApiStreamBaseChunk & {
	/**
	 * - START: 表示开始写当前卡片，后续所有内容写入卡片配置中，
	 * - END: 表示结束写当前卡片，卡片内容写完，后续文本写入消息中
	 * - key 帮我换个名字
	 * */
	cardMsgType: ServerCardMessageType;
	id: string; // 卡片唯一 ID
	type: ServerMessageType.CARD;
	cardType: ServerMessageCardType;
	cardContent?: string;
};

// 后面丰富一下这个类型，支持：images、card 等类型
export interface ApiStreamTextChunk extends ApiStreamBaseChunk {
	type: ServerMessageType.TEXT;
}
