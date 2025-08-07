import { ConversationMessageType } from '../messages/chatMessages/interface';

export type ConversationInfo = {
    conversationId: string;
    displayName: string;
    messages: ConversationMessageType[];
    createdAt: string;
    updatedAt: string;
};

export type ConversationsPageInfo = {
    hasMore: boolean;
    nextBefore: string;
    nextAfter: string;
    items: ConversationInfo[];
};
