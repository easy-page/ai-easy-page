import {
	ChatMessageRole,
	ClientMessageFrom,
} from '../../../common/constants/message';
import { ConversationMessageType } from '../../../common/interfaces/messages/chatMessages/interface';
import { renderApi } from '../../../renderApis';
import { getErrorMessage } from './getErrorMsg';

export const doPerformMemoryRefresh =
	({
		saveProgressMsg,
		savedConversationId,
		saveMessageToState,
		venueId,
	}: {
		savedConversationId: string;
		saveProgressMsg: (msg: ConversationMessageType) => Promise<void>;
		saveMessageToState: (msg: ConversationMessageType) => void;
		venueId: number;
	}) =>
	async () => {
		saveProgressMsg({
			conversation_id: savedConversationId,
			role: ChatMessageRole.INFO,
			content:
				'Refreshing hierarchical memory (GEMINI.md or other context files)...',
			msg_from: ClientMessageFrom.CLIENT,
			venue_id: venueId,
		});

		try {
			const { memoryContent, fileCount } =
				await renderApi.loadServerHierarchicalMemory({ venueId });
			console.log('memoryContent:', memoryContent);
			console.log('fileCount:', fileCount);
			saveProgressMsg({
				venue_id: venueId,
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
				venue_id: venueId,
				role: ChatMessageRole.ERROR,
				content: `Error refreshing memory: ${errorMessage}`,
				msg_from: ClientMessageFrom.CLIENT,
			});
			console.error('Error refreshing memory:', error);
		}
	};
