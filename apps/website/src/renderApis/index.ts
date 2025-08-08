import { BaseRenderApi, ResponseMessage } from './interface';
import { Content, PartListUnion } from '../common/interfaces/message';
import { RequestResult } from '@/apis/axios';

interface CreateGitRepoParams {
	venueName: string;
	venueDescription: string;
	venueId: number;
}

interface CreateGitRepoResult {
	gitUrl: string;
}

interface PushToGitRepoParams {
	localPath: string;
	venueId: number;
	gitUrl: string;
}

interface PushToGitRepoResult {
	message?: string;
}

interface StartProjectParams {
	venueId: number;
	defaultPort?: number;
}

interface StartProjectResult {
	port: number;
	path: string;
	occupiedPorts?: number[];
}

interface StopProjectParams {
	venueId: number;
}

interface StopProjectResult {
	message: string;
}

interface RestartProjectParams {
	venueId: number;
}

interface RestartProjectResult {
	port: number;
	path: string;
	occupiedPorts?: number[];
}

interface AddDependenciesParams {
	venueId: number;
	dependencies: string[];
	isDev?: boolean;
}

interface AddDependenciesResult {
	message: string;
}

interface CleanProjectParams {
	venueId: number;
}
interface CleanProjectResult {
	message: string;
}

class WebRenderApi extends BaseRenderApi {
	initClient(params: { venueId: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}
	addHistory(params: { content: Content; venueId: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}
	loadServerHierarchicalMemory(params: { venueId: number }): Promise<{
		memoryContent: string;
		fileCount: number;
	}> {
		throw new Error('Method not implemented.');
	}
	updateSettings(params: { key: string; value: any }): Promise<any> {
		return Promise.resolve();
	}

	getLocalImg(path: string): string {
		return path;
	}
	uploadFiles(params: {
		id: number;
		fileContent?: string;
		fileBuffer?: ArrayBuffer;
		oriFilePath?: string;
		success: true;
		fileName: string;
	}): Promise<RequestResult<{ fileName: string; filePath: string }>> {
		return Promise.resolve({
			data: {
				fileName: '',
				filePath: '',
				success: true,
			},
			success: true,
			status: 200,
		});
	}

	createGitRepo(
		params: CreateGitRepoParams
	): Promise<RequestResult<CreateGitRepoResult>> {
		return Promise.resolve({
			success: true,
			data: {
				gitUrl: 'https://github.com/example/mock-repo.git',
			},
		});
	}

	pushToGitRepo(
		params: PushToGitRepoParams
	): Promise<RequestResult<PushToGitRepoResult>> {
		return Promise.resolve({
			success: true,
			data: {
				message: 'Successfully pushed code to mock repository',
			},
		});
	}

	startProject(
		params: StartProjectParams
	): Promise<RequestResult<StartProjectResult>> {
		return Promise.resolve({
			success: true,
			data: {
				port: 3000,
				path: '/mock/path',
				occupiedPorts: [],
			},
		});
	}

	stopProject(
		params: StopProjectParams
	): Promise<RequestResult<StopProjectResult>> {
		return Promise.resolve({
			success: true,
			data: {
				message: 'Project stopped successfully',
			},
		});
	}

	restartProject(
		params: RestartProjectParams
	): Promise<RequestResult<RestartProjectResult>> {
		return Promise.resolve({
			success: true,
			data: {
				port: 3000,
				path: '/mock/path',
				occupiedPorts: [],
			},
		});
	}

	addDependencies(
		params: AddDependenciesParams
	): Promise<RequestResult<AddDependenciesResult>> {
		return Promise.resolve({
			success: true,
			data: {
				message: 'Dependencies added successfully',
			},
		});
	}

	// 日志相关方法的模拟实现
	getCvChunkLogs(provider: string): Promise<RequestResult<string[]>> {
		return Promise.resolve({
			success: true,
			data: ['mock-conversation-1', 'mock-conversation-2'],
			status: 200,
		});
	}

	getMsgChunkLogs({
		provider,
		conversationId,
	}: {
		provider: string;
		conversationId: string;
	}): Promise<RequestResult<string[]>> {
		return Promise.resolve({
			success: true,
			data: ['mock-message-1.json', 'mock-message-2.json'],
			status: 200,
		});
	}

	getMsgContent({
		provider,
		conversationId,
		messageId,
	}: {
		provider: string;
		conversationId: string;
		messageId: string;
	}): Promise<RequestResult<any>> {
		return Promise.resolve({
			success: true,
			data: {
				id: messageId,
				content: 'Mock message content',
				timestamp: Date.now(),
			},
			status: 200,
		});
	}

	// 窗口通信相关方法的模拟实现
	getCurrentWindowId(): string | null {
		return null; // Web环境没有窗口ID
	}

	registerMessageHandler(type: string, handler: (data: any) => void): void {
		console.log(`Web环境模拟注册消息处理器: ${type}`);
		// Web环境不做实际操作
	}

	registerPromiseMessageHandler(
		type: string,
		handler: (data: any) => Promise<any>,
		options?: { when?: (data: any) => boolean }
	): void {
		console.log(`Web环境模拟注册消息处理器: ${type}`);
		// Web环境不做实际操作
	}

	unregisterMessageHandler(type: string): void {
		console.log(`Web环境模拟注销消息处理器: ${type}`);
		// Web环境不做实际操作
	}

	sendMessageResponse(response: ResponseMessage): void {
		console.log('Web环境模拟发送消息响应:', response);
		// Web环境不做实际操作
	}

	onWindowMessage(callback: (type: string, data: any) => void): () => void {
		console.log('Web环境模拟监听窗口消息');
		// 返回一个空函数作为取消监听的方法
		return () => {
			console.log('Web环境模拟取消监听窗口消息');
		};
	}

	getPreloadApi() {
		return window;
	}

	sendMessageStream(params: {
		message: PartListUnion;
		promptId: string;
		venueId: number;
		conversationId: string;
	}): Promise<RequestResult<any>> {
		return Promise.resolve({
			success: true,
			data: { message: 'Mock message stream response' },
			status: 200,
		});
	}

	abortMessageStream({
		promptId,
		venueId,
	}: {
		promptId: string;
		venueId: number;
	}): Promise<RequestResult<any>> {
		return Promise.resolve({
			success: true,
			data: { message: 'Mock abort message stream response' },
			status: 200,
		});
	}
}

export const renderApi = new WebRenderApi();
