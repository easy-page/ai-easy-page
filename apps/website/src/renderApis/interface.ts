import { RequestResult } from '@/apis/axios';
import { Content, PartListUnion } from '../common/interfaces/message';

// 定义响应消息接口
export interface ResponseMessage {
	requestId: string;
	success: boolean;
	data?: any;
	error?: string;
}

export abstract class BaseRenderApi {
	abstract addHistory(params: {
		content: Content;
		venueId: number;
	}): Promise<void>;

	removeLoading(): void {}
	abstract uploadFiles(params: {
		id: number;
		fileContent?: string;
		fileBuffer?: ArrayBuffer;
		oriFilePath?: string;
		fileName: string;
	}): Promise<
		RequestResult<{
			fileName: string;
			filePath: string;
		}>
	>;

	abstract loadServerHierarchicalMemory(params: { venueId: number }): Promise<{
		memoryContent: string;
		fileCount: number;
	}>;

	// 窗口通信相关方法
	abstract getCurrentWindowId(): string | null;
	abstract registerPromiseMessageHandler(
		type: string,
		handler: (data: any) => Promise<any>,
		options?: { when?: (data: any) => boolean }
	): void;
	abstract registerMessageHandler(
		type: string,
		handler: (data: any) => void
	): void;
	abstract unregisterMessageHandler(type: string): void;
	abstract sendMessageResponse(response: ResponseMessage): void;
	abstract onWindowMessage(
		callback: (type: string, data: any) => void
	): () => void;

	abstract initClient(params: { venueId: number }): Promise<void>;
	// 消息流相关方法
	abstract sendMessageStream(params: {
		message: PartListUnion;
		promptId: string;
		conversationId: string;
		venueId: number;
	}): Promise<RequestResult<any>>;
	abstract abortMessageStream(params: {
		promptId: string;
		venueId: number;
	}): Promise<RequestResult<any>>;

	// 日志相关方法
	abstract getCvChunkLogs(provider: string): Promise<RequestResult<string[]>>;
	abstract getMsgChunkLogs(params: {
		provider: string;
		conversationId: string;
	}): Promise<RequestResult<string[]>>;
	abstract getMsgContent(options: {
		provider: string;
		conversationId: string;
		messageId: string;
	}): Promise<RequestResult<any>>;
}
