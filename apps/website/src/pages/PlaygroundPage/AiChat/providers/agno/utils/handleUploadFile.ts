import {
	ChatMessageContext,
	ChatMessageContextType,
	FileMessageContext,
	ImageMessageContext,
} from '../../../common/interfaces/messages/chatMessages/context';
import { uploadMbdFile } from './util';

export const handleUploadFile = async (
	context: ChatMessageContext[]
): Promise<ChatMessageContext[]> => {
	if (!context) {
		return [];
	}
	const newContext: ChatMessageContext[] = [];
	for (const item of context) {
		if (
			[ChatMessageContextType.FILE, ChatMessageContextType.IMAGE].includes(
				item.type
			)
		) {
			const curItem = item as FileMessageContext | ImageMessageContext;
			const uploadResult = await uploadMbdFile({
				mimeType: curItem.mimeType || '',
				displayName: curItem.fileName || '',
				file: curItem.file || new File([], ''),
			});
			newContext.push({
				...curItem,
				fileUrl: uploadResult.fileUrl || '',
				base64Url: undefined,
				file: undefined,
			});
		} else {
			newContext.push(item);
		}
	}
	return newContext;
};
