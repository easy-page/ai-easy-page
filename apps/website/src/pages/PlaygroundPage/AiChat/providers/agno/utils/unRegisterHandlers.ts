import { renderApi } from '@/renderApis';
import { EVENT_NAME } from '@shared/constant';

export const unRegisterHandlers = () => {
	renderApi.unregisterMessageHandler(EVENT_NAME.AiStreamMsg);
	renderApi.unregisterMessageHandler(EVENT_NAME.AiToolCallOutput);
	renderApi.unregisterMessageHandler(EVENT_NAME.AiToolCallUpdate);
	renderApi.unregisterMessageHandler(EVENT_NAME.AiToolCallComplete);
	// renderApi.unregisterMessageHandler(EVENT_NAME.SaveMsg);
};
