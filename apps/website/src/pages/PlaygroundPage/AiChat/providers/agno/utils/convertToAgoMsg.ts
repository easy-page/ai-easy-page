import {
	AssistantClientMessage,
	UserClientMessage,
} from '@/common/interfaces/messages/chatMessages/client';
import {
	ChatMessageContext,
	ChatMessageContextType,
	FileMessageContext,
	ImageMessageContext,
} from '@/common/interfaces/messages/chatMessages/context';
import { Part, PartListUnion } from '@shared/message';
import { handleUploadFile } from './handleUploadFile';

export const convertToAgoMsg = async (
	curMessage: UserClientMessage | AssistantClientMessage,
	conversationId: string | undefined
): Promise<{ parts: PartListUnion; context: ChatMessageContext[] }> => {
	// 处理文件上传
	const processedContext = await handleUploadFile(curMessage.context);

	// 构建基础消息部分
	const parts: Part[] = [];

	// 添加文本内容
	if (curMessage.content) {
		parts.push({ text: curMessage.content });
	}

	// 处理上下文中的文件
	for (const context of processedContext) {
		if (
			context.type === ChatMessageContextType.FILE ||
			context.type === ChatMessageContextType.IMAGE
		) {
			const fileContext = context as FileMessageContext | ImageMessageContext;

			if (fileContext.fileUrl) {
				// 如果有文件URL，创建 FileData 类型的 Part
				parts.push({
					fileData: {
						fileUri: fileContext.fileUrl,
						mimeType: fileContext.mimeType || 'application/octet-stream',
						displayName: fileContext.fileName || 'file',
					},
				});
			} else if (fileContext.base64Url) {
				// 如果有 base64 数据，创建 inlineData 类型的 Part
				parts.push({
					inlineData: {
						data: fileContext.base64Url.split(',')[1] || fileContext.base64Url, // 移除 data:image/png;base64, 前缀
						mimeType: fileContext.mimeType || 'application/octet-stream',
						displayName: fileContext.fileName || 'file',
					},
				});
			}
		}
	}

	// 如果没有内容，返回空数组
	if (parts.length === 0) {
		return { parts: [], context: processedContext };
	}

	// 如果只有一个文本部分，直接返回字符串
	if (parts.length === 1 && parts[0].text) {
		return { parts: parts[0].text, context: processedContext };
	}

	// 否则返回 Part 数组
	return { parts, context: processedContext };
};
