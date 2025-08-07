import { ChatMessageRole, ClientMessageFrom } from '@/common/constants/message';
import { ConversationMessageType } from '@/common/interfaces/messages/chatMessages/interface';
import { renderApi } from '@/renderApis';
import { getErrorMessage } from './getErrorMsg';

export const doPerformMemoryRefresh =
	({
		saveProgressMsg,
		savedConversationId,
		saveMessageToState,
	}: {
		savedConversationId: string;
		saveProgressMsg: (msg: ConversationMessageType) => Promise<void>;
		saveMessageToState: (msg: ConversationMessageType) => void;
	}) =>
	async () => {
		saveProgressMsg({
			conversation_id: savedConversationId,
			role: ChatMessageRole.INFO,
			content:
				'Refreshing hierarchical memory (GEMINI.md or other context files)...',
			msg_from: ClientMessageFrom.CLIENT,
		});

		try {
			const { memoryContent, fileCount } =
				await renderApi.loadServerHierarchicalMemory();
			console.log('memoryContent:', memoryContent);
			console.log('fileCount:', fileCount);
			saveProgressMsg({
				conversation_id: savedConversationId,
				role: ChatMessageRole.INFO,
				content: `Memory refreshed successfully. ${
					memoryContent.length > 0
						? `Loaded ${memoryContent.length} characters from ${fileCount} file(s).`
						: 'No memory content found.'
				}`,
				msg_from: ClientMessageFrom.CLIENT,
			});
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			saveMessageToState({
				conversation_id: savedConversationId,
				role: ChatMessageRole.ERROR,
				content: `Error refreshing memory: ${errorMessage}`,
				msg_from: ClientMessageFrom.CLIENT,
			});
			console.error('Error refreshing memory:', error);
		}
	};
