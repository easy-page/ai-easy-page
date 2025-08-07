import {
	ConversationInfo,
	ConversationsPageInfo,
} from '../../common/interfaces/conversation';
import {
	UserClientMessage,
	AssistantClientMessage,
	AssistantClientMessageToServer,
} from '../../common/interfaces/messages/chatMessages/client';
import {
	ServerMessage,
	ServerMsgCard,
} from '../../common/interfaces/messages/chatMessages/server';
import {
	ApiStream,
	ApiStreamChunk,
	ServerMessageChunk,
} from '../../common/interfaces/messages/stream';
import {
	ApiProvider,
	CreateMessageOptions,
	FeedbackInfo,
	FeedBackType,
	FinishTaskStepParams,
} from '../common';
import {
	ChatMessageRole,
	ClientMessageFrom,
	ServerCardMessageType,
	ServerMessageCardType,
	ServerMessageType,
	ServerMsgType,
} from '../../common/constants/message';
import { AgnoClientMessage } from './message';

import { CurConversation } from '../../services/chatGlobalState/chatGlobalStateEntity';
import { SenceConfig } from '../../common/interfaces/senceConfig';
import { DefaultSenceData } from './senceData';
import { EnvEnum, getEnv } from '../../common/utils/env';
import {
	ChatMessageContext,
	ChatMessageContextType,
	FileMessageContext,
	ImageMessageContext,
} from '../../common/interfaces/messages/chatMessages/context';
import { uploadMbdFile } from './utils/util';
import { PartListUnion, Part } from '../../common/interfaces/message';

import {
	FrontCompletedToolCall,
	FrontToolCall,
	ServerStreamEvent,
	TrackedCancelledToolCall,
	TrackedCompletedToolCall,
	TrackedToolCall,
	TurnEventType,
} from '../../common/interfaces/serverChunk';
import { ConversationMessageType } from '../../common/interfaces/messages/chatMessages/interface';
import { SlashCommandProcessorResult } from './interface';
import { mergePartListUnions } from './utils/mergePartListUnions';
import { getErrorMessage } from './utils/getErrorMsg';
import { getSenceConfig } from './utils/getSenceConfig';
import { convertToAgoMsg } from './utils/convertToAgoMsg';
import { getServerMessageFromChunk } from './utils/getServerMessageFromChunk';
import { convertServerMsgToFrontChunk } from './utils/convertServerMsgToFrontChunk';
import { prepareQueryForGemini } from './utils/prepareQueryForGemini';
import { doHandleStreamMsg } from './utils/handleStreamMsg';
import { doHandleComplateTools } from './utils/handleComplateTools';
import { doPerformMemoryRefresh } from './utils/performMemoryRefresh';
import { unRegisterHandlers } from './utils/unRegisterHandlers';
import { sendMessageStreamWithHandlers } from './utils/sendMessageStream';
import { registerEventHandlers } from './utils/registerEventHandlers';
import { createToolCallHandlers } from './utils/createToolCallHandlers';
import { RequestResult } from '../../apis/axios';

export const generateCardId = (cardPrefix: string) => {
	return `${cardPrefix}_${Math.random().toString(36).substring(2, 15)}`;
};

export class AgnoServer extends ApiProvider {
	private csrfToken: string | null = null;
	async getFeedback(task_id: number): Promise<RequestResult<FeedbackInfo>> {
		const res = await this.fetchReq({
			method: 'GET',
			url: `/feedbacks/feedback-get/${task_id}`,
			body: {},
		});

		return res;
	}

	async createFeedback(options: {
		taskId: number;
		feedScore: number;
		feedType: FeedBackType;
		feedContent: string;
	}): Promise<RequestResult<any>> {
		const res = await this.fetchReq({
			method: 'POST',
			url: `/feedbacks/feedback`,
			body: {
				feedback_score: options.feedScore,
				feedback_content: options.feedContent,
				task_id: options.taskId,
				feed_type: options.feedType,
			},
		});

		if (!res?.data?.id) {
			return {
				success: false,
				message: '反馈失败',
			};
		}

		return {
			success: true,
			data: res.data,
		};
	}

	async getSenceConfigs(
		userMis: string
	): Promise<RequestResult<SenceConfig[]>> {
		return getSenceConfig(userMis);
	}
	baseUrl: string = '/zspt-agent-api/v1';

	async finishTaskStep(params: FinishTaskStepParams): Promise<any> {
		const res = await this.fetchReq({
			method: 'POST',
			url: `/tasks/tsk-update`,
			body: params,
		});
		console.log('finishTaskStep res:', res);
		return res;
	}

	async updateConversation(
		conversationId: string,
		options: { name?: string }
	): Promise<RequestResult<ConversationInfo>> {
		const res = await this.fetchReq({
			method: 'POST',
			url: `/conversations/cv-update/${conversationId}`,
			body: {
				name: options?.name || '新对话',
			},
		});

		if (!res.id) {
			return {
				success: false,
				message: '更新会话失败',
			};
		}

		return {
			success: true,
			data: {
				conversationId: res.id.toString(),
				createdAt: res.created_at,
				displayName: res.name || '新对话',
				messages: [],
				updatedAt: res.updated_at,
			},
		};
	}

	async getConversation(
		conversationId: string
	): Promise<RequestResult<ConversationInfo>> {
		try {
			const res = await this.fetchReq({
				method: 'GET',
				url: `/conversations/cv/${conversationId}`,
				body: {},
			});

			console.log('res=======', res);

			if (!res.id) {
				return {
					success: false,
					message: '获取对话失败',
				};
			}

			return {
				success: true,
				data: {
					conversationId: res.id.toString(),
					displayName: res.title || '新对话',
					messages: [],
					createdAt: res.created_at,
					updatedAt: res.updated_at,
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error instanceof Error ? error.message : '获取对话失败',
			};
		}
	}

	async intCsrfToken(): Promise<RequestResult<string>> {
		const res = await this.fetchReq({
			method: 'POST',
			url: '/common/getCsrfToken',
			body: {},
			baseUrl: '',
		});

		this.csrfToken = res.data;

		return res;
	}

	async createConversation(options: {
		title?: string;
		venueId: number;
	}): Promise<RequestResult<ConversationInfo>> {
		const res = await this.fetchReq({
			method: 'POST',
			url: '/conversations/cv',
			body: {
				name: options?.title || '新对话',
				venueId: options?.venueId,
			},
		});

		if (!res.id) {
			return {
				success: false,
				message: '创建会话失败',
			};
		}

		return {
			success: true,
			data: {
				conversationId: res.id.toString(),
				createdAt: res.created_at,
				displayName: res.name || '新对话',
				messages: [],
				updatedAt: res.updated_at,
			},
		};
	}

	async getConversations(options?: {
		limit?: number;
		before?: string;
		after?: string;
		venueId: number;
	}): Promise<RequestResult<ConversationsPageInfo>> {
		const res = await this.fetchReq({
			method: 'GET',
			url: '/conversations/cv/get-conversation-list',
			body: {
				limit: options?.limit,
				before: options?.before,
				after: options?.after,
				venueId: options?.venueId,
			},
		});

		console.log('res=======', res);

		if (!res.items) {
			return {
				success: false,
				message: '获取会话列表失败',
			};
		}

		return {
			success: true,
			data: {
				hasMore: res.has_more,
				nextAfter: res.next_cursor,
				nextBefore: res.prev_cursor,
				items: res.items.map((conv: any) => ({
					conversationId: conv.cvid.toString(),
					createdAt: conv.created_at,
					displayName: conv.name || '新对话',
					messages: [],
					updatedAt: conv.updated_at,
				})),
			},
		};
	}

	async getTaskDetail(options: {
		taskId: number;
	}): Promise<RequestResult<any>> {
		const res = await this.fetchReq({
			method: 'GET',
			url: `/tasks/tsk/${options.taskId}`,
			body: {
				taskId: options.taskId,
			},
		});

		if (!res) {
			return {
				success: false,
				message: '获取任务详情失败',
			};
		}

		return {
			success: true,
			data: res,
		};
	}

	async getConversationMessages(
		conversationId: string,
		options: { limit?: number; before?: any; after?: any }
	): Promise<RequestResult<CurConversation>> {
		let url = `/messages/conversation/${conversationId}`;
		const queryParams = [];
		console.log('optionsoptionsoptions:', options);
		if (options?.limit) {
			queryParams.push(`limit=${options.limit}`);
		}
		if (options?.before) {
			queryParams.push(`before=${options.before}`);
		}
		if (options?.after) {
			queryParams.push(`after=${options.after}`);
		}

		if (queryParams.length > 0) {
			url += `?${queryParams.join('&')}`;
		}
		const res = await this.fetchReq({
			method: 'GET',
			url: url,
			body: {},
		});

		console.log('resresres:', res);

		return {
			success: true,
			data: {
				conversationId: `${conversationId || ''}`,
				displayName: res.displayName || '新对话',
				// 后端返回的消息应该是这个结构：ConversationMessageType
				messages: (res.messages || []).map((x: any) => {
					const oriCards = x.cards || {};
					const newCards: Record<string, ServerMsgCard<any>> = {};
					Object.keys(oriCards).forEach((key) => {
						const card = {
							...oriCards[key],
							detail: oriCards[key].detail || {},
						};
						newCards[key] = card;
					});
					return {
						...x,
						cards: newCards,
					};
				}),
				createdAt: res.updatedAt,
				updatedAt: res.createdAt,
				loaded: true,
				hasMore: res.hasMore,
				nextAfter: res.nextAfter,
				nextBefore: res.nextBefore,
			},
		};
	}

	async deleteConversation(
		conversationId: string
	): Promise<RequestResult<any>> {
		const res = await this.fetchReq({
			method: 'DELETE',
			url: `/conversations/cv/${conversationId}`,
			body: {},
		});
		if (res.code !== 0) {
			return {
				success: false,
				message: '删除会话失败',
				data: null,
			};
		}
		return {
			success: true,
			message: '删除会话成功',
			data: null,
		};
	}

	async convertToAgoMsg(
		curMessage: UserClientMessage | AssistantClientMessage,
		conversationId: string | undefined
	): Promise<{ parts: PartListUnion; context: ChatMessageContext[] }> {
		return convertToAgoMsg(curMessage, conversationId);
	}

	shouldSaveMessageToServer(): boolean {
		return true;
	}

	async saveMessage(message: ServerMessage): Promise<string> {
		console.log('saveMessage 到服务端', message);
		const res = await this.saveMsg({
			...message,
			role: ChatMessageRole.ASSISTANT,
			msg_from: ClientMessageFrom.SERVER,
		} as AssistantClientMessageToServer);
		if (!res.success || !res.data?.id) {
			throw new Error('保存服务端消息失败');
		}
		return `${res.data?.id || ''}`;
	}

	// 保存用户发送的消息，获取消息id、会话 Id
	async saveMsg(msg: ConversationMessageType) {
		const res = await this.fetchReq({
			method: 'POST',
			url: '/messages/save-msg',
			body: msg,
		});
		return res;
	}

	// private async handleSlashCommand(
	// 	rawQuery: PartListUnion
	// ): Promise<SlashCommandProcessorResult | false> {
	// 	// if (typeof rawQuery !== 'string') {
	// 	// 	return false;
	// 	// }
	// 	// const trimmed = rawQuery.trim();
	// 	// if (!trimmed.startsWith('/') && !trimmed.startsWith('?')) {
	// 	// 	return false;
	// 	// }
	// 	// const parts = trimmed.substring(1).trim().split(/\s+/);
	// 	// const commandPath = parts.filter((p) => p); // The parts of the command, e.g., ['memory', 'add']
	//   //   let currentCommands = commands;
	//   //   let commandToExecute: SlashCommand | undefined;
	//   //   let pathIndex = 0;

	// }

	async *doCreateMessage({
		curMessage,
		messages,
		conversationId,
		venueId,
		saveMessageToState,
	}: CreateMessageOptions): ApiStream {
		try {
			const { parts: lastMessage, context } = await this.convertToAgoMsg(
				curMessage,
				conversationId
			);

			const saveRes = await this.saveMsg({
				conversation_id: conversationId || '',
				id: curMessage.id || '',
				role: ChatMessageRole.USER,
				content: curMessage.content || '',
				venue_id: venueId,
				msg_from: ClientMessageFrom.CLIENT,
				context,
				csrf_token: this.csrfToken || '',
				business_info: {
					env: getEnv(),
				},
			});
			console.log('saveRes:', saveRes);
			if (!saveRes.success || !saveRes.data?.id) {
				throw new Error('保存消息失败');
			}

			const savedConversationId = saveRes.data.conversation_id;

			// 使用真正的流式迭代器
			yield* this.createRealTimeStream({
				message: lastMessage,
				messageId: curMessage.id || '',
				conversationId: conversationId || '',
				lastMessage,
				curMessage,
				context,
				saveMessageToState,
				savedConversationId,
				venueId,
			});
		} catch (error) {
			console.error('发送请求失败:', error);
			yield this.generageErrorServerMessage({
				content: '出错啦，请稍后重试',
				curMessageId: curMessage.id || '',
				conversationId: conversationId || '',
				venueId,
			});
		}
	}

	private async *createRealTimeStream({
		savedConversationId,
		messageId,
		conversationId,
		lastMessage,
		curMessage,
		saveMessageToState,
		venueId,
	}: {
		savedConversationId: string;
		message: PartListUnion;
		messageId: string;
		conversationId: string;
		lastMessage: PartListUnion;
		context?: ChatMessageContext[];
		curMessage: UserClientMessage | AssistantClientMessage;
		venueId: number;
		saveMessageToState: (msg: ConversationMessageType) => void;
	}): AsyncGenerator<ServerMessageChunk, void, unknown> {
		// 准备查询
		const { queryToSend, shouldProceed } = await prepareQueryForGemini(
			lastMessage,
			new Date().getTime(),
			this.abortController?.signal!,
			curMessage.id || ''
		);

		if (!shouldProceed || queryToSend === null) {
			return;
		}

		const savedAssistantMsgId = await this.saveMessage({
			conversation_id: conversationId || '',
			role: ChatMessageRole.ASSISTANT,
			content: '',
			venue_id: venueId,
			msg_from: ClientMessageFrom.SERVER,
			type: ServerMsgType.NORMAL,
			isStreaming: true,
		});

		// 状态管理
		const processedMemoryTools = new Set<string>();
		const queue: ServerMessageChunk[] = [];
		let isComplete = false;
		let currentResolve: ((value: ServerMessageChunk) => void) | null = null;
		let currentReject: ((error: any) => void) | null = null;
		const pendingToolCalls: string[] = [];
		let nextPartList: PartListUnion | undefined = undefined;

		// 创建工具调用处理器
		const { handleToolCallOutput, handleToolCallUpdate } =
			createToolCallHandlers({
				savedConversationId,
				savedAssistantMsgId,
				conversationId,
				messageId,
				venueId,
				getCurrentResolve: () => currentResolve,
				getCurrentReject: () => currentReject,
				clearCurrentResolve: () => {
					currentResolve = null;
					currentReject = null;
				},
				addQueue: (chunk) => queue.push(chunk),
				removePendingToolCall: (id) => {
					const index = pendingToolCalls.indexOf(id);
					if (index > -1) {
						pendingToolCalls.splice(index, 1);
					}
				},
			});

		// 创建流消息处理器
		const handleStreamMsg = doHandleStreamMsg({
			savedConversationId,
			savedAssistantMsgId,
			updateComplated: () => {
				isComplete = pendingToolCalls.length === 0;
			},
			addPendingToolCalls: (id) => pendingToolCalls.push(id),
			addQueue: (chunk) => queue.push(chunk),
			conversationId,
			getCurrentResolve: () => currentResolve,
			getCurrentReject: () => currentReject,
			clearCurrentResolve: () => {
				currentResolve = null;
				currentReject = null;
			},
			messageId,
			venueId,
		});

		// 创建工具完成处理器
		const handleToolCallComplete = async (data: FrontCompletedToolCall[]) => {
			console.log('【工具调用】收到工具调用完成:', data);

			const chunk = convertServerMsgToFrontChunk({
				chunk: {
					type: TurnEventType.ToolCallComplete,
					value: data,
				},
				venueId,
				conversationId: savedConversationId,
				messageId: savedAssistantMsgId,
				originalConversationId: conversationId,
				originalMessageId: messageId,
			});

			const currentResolveValue = currentResolve;
			if (currentResolveValue) {
				currentResolveValue(chunk);
				currentResolve = null;
				currentReject = null;
			} else {
				queue.push(chunk);
			}

			nextPartList = await doHandleComplateTools({
				venueId,
				addProcessedMemoryTools: (callId) => processedMemoryTools.add(callId),
				hasPendingToolCalls: () => pendingToolCalls.length > 0,
				hasProcessedMemoryTools: (callId) => processedMemoryTools.has(callId),
				setComplated: (complated: boolean) => {
					isComplete = complated;
				},
				performMemoryRefresh: doPerformMemoryRefresh({
					savedConversationId,
					saveMessageToState,
					saveProgressMsg: async (msg: ConversationMessageType) => {
						const res = await this.saveMsg(msg);
						if (res.success && res.data?.id) {
							saveMessageToState({ ...msg, id: res.data.id });
						}
					},
				}),
			})(data);
		};

		// 注册事件处理器
		registerEventHandlers({
			messageId,
			handleStreamMsg,
			handleToolCallOutput,
			handleToolCallUpdate,
			handleToolCallComplete,
		});

		// 发送消息流
		sendMessageStreamWithHandlers({
			savedAssistantMsgId,
			savedConversationId,
			venueId,
			queryToSend,
			onComplete: () => {
				if (pendingToolCalls.length === 0) {
					const currentResolveValue = currentResolve;
					if (currentResolveValue) {
						const endChunk: ServerMessageChunk = {
							conversationId: savedConversationId,
							originalMessageId: messageId,
							serverMessage: {
								id: '',
								venue_id: venueId,
								role: ChatMessageRole.ASSISTANT,
								content: '',
								conversation_id: savedConversationId,
								msg_from: ClientMessageFrom.SERVER,
								type: ServerMsgType.NORMAL,
								isStreaming: false,
							},
						};
						currentResolveValue(endChunk);
					}
					currentResolve = null;
					currentReject = null;
					isComplete = true;
					unRegisterHandlers();
				}
			},
			onError: (error) => {
				console.log('【工具调用】error:', error);
				isComplete = true;
				if (currentReject) {
					currentReject(error);
				}
				currentResolve = null;
				currentReject = null;
			},
		});

		// 持续 yield 数据直到完成
		while (!isComplete) {
			console.log('221isComplete:', isComplete);
			try {
				// 等待下一个 chunk
				const chunk = await new Promise<ServerMessageChunk>(
					(resolve, reject) => {
						if (queue.length > 0) {
							const item = queue.shift()!;
							resolve(item);
						} else {
							currentResolve = resolve;
							currentReject = reject;
						}
					}
				);

				yield chunk;

				// 检查是否有后续的 partList 需要处理
				if (nextPartList) {
					const nextPartListMsg = nextPartList;
					nextPartList = undefined;
					console.log('nextPartListMsg:', nextPartListMsg);

					// 重置状态，准备处理下一个 partList
					isComplete = false;
					pendingToolCalls.length = 0;
					processedMemoryTools.clear();

					// 准备新的查询
					const { queryToSend: nextQuery, shouldProceed: nextShouldProceed } =
						await prepareQueryForGemini(
							nextPartListMsg,
							new Date().getTime(),
							this.abortController?.signal!,
							curMessage.id || ''
						);

					if (
						(!nextShouldProceed || nextQuery === null) &&
						pendingToolCalls.length === 0
					) {
						isComplete = true;
						break;
					}

					// 发送新的消息流
					sendMessageStreamWithHandlers({
						savedAssistantMsgId,
						savedConversationId,
						venueId,
						queryToSend: nextQuery,
						onComplete: () => {
							if (pendingToolCalls.length === 0) {
								isComplete = true;
								const currentResolveValue = currentResolve;
								if (currentResolveValue) {
									const endChunk: ServerMessageChunk = {
										conversationId: savedConversationId,
										originalMessageId: messageId,
										serverMessage: {
											id: '',
											venue_id: venueId,
											role: ChatMessageRole.ASSISTANT,
											content: '',
											conversation_id: savedConversationId,
											msg_from: ClientMessageFrom.SERVER,
											type: ServerMsgType.NORMAL,
											isStreaming: false,
										},
									};
									currentResolveValue(endChunk);
								}
								currentResolve = null;
								currentReject = null;
							}
						},
						onError: (error) => {
							console.log('【后续工具调用】error:', error);
							isComplete = true;
							if (currentReject) {
								currentReject(error);
							}
							currentResolve = null;
							currentReject = null;
						},
					});
				}
			} catch (error) {
				unRegisterHandlers();
				throw error;
			}
		}

		console.log(
			'消息流处理完成: 111isComplete:',
			new Date().getTime(),
			isComplete
		);
	}
}
