import { RouterNames } from './constant';
import { appendParamsToUrl, ToPageHandler } from './utils';

export type ChatPageParams = {
    chatId?: string;
};

const LOCAL_ID_PREFIX = 'local_';
export const generateLocalId = () => {
    return `${LOCAL_ID_PREFIX}${Math.random().toString(36).substring(2, 15)}`;
};

export const generateContextId = () => {
    return `context_${Math.random().toString(36).substring(2, 15)}`;
};

export const isLocalId = (id: string) => {
    return id.startsWith(LOCAL_ID_PREFIX);
};

export const getChatUrl = (params: ChatPageParams) => {
    if (!params.chatId) {
        console.log('generateLocalId123213123:', params);
        params.chatId = generateLocalId();
    }
    return appendParamsToUrl(RouterNames.Chat, params);
};

export const toChat: ToPageHandler<ChatPageParams> = (params, target) => {
    window.open(getChatUrl(params), target);
};
