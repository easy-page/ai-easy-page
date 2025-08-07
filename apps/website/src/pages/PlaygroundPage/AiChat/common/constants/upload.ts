import { ChatMessageContextType } from '../interfaces/messages/chatMessages/context';

export const UploadAcceptType: Partial<Record<ChatMessageContextType, string>> = {
    [ChatMessageContextType.IMAGE]: 'image/*',
    [ChatMessageContextType.FILE]:
        '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
