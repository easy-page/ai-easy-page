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
	ApiStreamCardChunk,
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

import { RequestResult } from '@/apis/axios';
import { TaskStatus } from '../../common/constants/task';
import { FullTaskInfo } from '../../common/interfaces/task';
import { toJson } from '../../common/utils/json';

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
		return Promise.resolve({
			success: true,
			data: DefaultSenceData,
		});
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

	async createConversation(options?: {
		title?: string;
	}): Promise<RequestResult<ConversationInfo>> {
		const res = await this.fetchReq({
			method: 'POST',
			url: '/conversations/cv',
			body: {
				name: options?.title || '新对话',
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
	}): Promise<RequestResult<ConversationsPageInfo>> {
		const res = await this.fetchReq({
			method: 'GET',
			url: '/conversations/cv/get-conversation-list',
			body: {
				limit: options?.limit,
				before: options?.before,
				after: options?.after,
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

	async getConversationMessages(
		conversationId: string,
		options?: { limit?: number; before?: any; after?: any }
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
							detail: oriCards[key].taskInfo || {},
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

	async handleUploadFile(
		context?: ChatMessageContext[]
	): Promise<ChatMessageContext[]> {
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
	}

	async convertToVenueMsg(
		curMessage: UserClientMessage | AssistantClientMessage,
		venueId: number,
		conversationId: string | undefined
	): Promise<AgnoClientMessage> {
		// const context: ChatMessageContext[] = [];
		// if (curMessage.context) {
		//     for (const item of curMessage.context) {
		//         if (item.type === ChatMessageContextType.FILE) {
		//             context.push({
		//                 type: ChatMessageContextType.FILE,
		//                 path: item.fileUrl,
		//                 displayName: item.fileName,
		//                 mimeType: item.mimeType,
		//                 id: item.id,
		//             } as FileMessageContext);
		//         }
		//     }
		// }
		const curContexts = await this.handleUploadFile(curMessage.context || []);
		console.log('curCont12321321exts:', this.csrfToken);
		return {
			conversation_id: `${conversationId || ''}`,
			content: curMessage.content,
			role: ChatMessageRole.USER,
			msg_from: ClientMessageFrom.CLIENT,
			context: curContexts,
			csrf_token: this.csrfToken || '',
			venue_id: venueId,
			business_info: {
				bizLine: 0,
				env: getEnv(),
			},
		};
	}

	getVenueServerMessageFromChunk(
		chunk: ApiStreamChunk,
		venueId: number
	): ServerMessage {
		if (chunk.type === ServerMessageType.CARD) {
			console.log(
				'cards===>: newCardsnewCards: chunk.cardContent12321321:',
				chunk.cardInStream
			);
			return {
				conversation_id: chunk.conversationId || '',
				id: chunk.messageId || '',
				role: ChatMessageRole.ASSISTANT,
				content: chunk.text || '',
				type: ServerMsgType.NORMAL,
				msg_from: ClientMessageFrom.SERVER,
				/** 这里都表示正在流式输出中 */
				venue_id: venueId || 0,
				isStreaming: true,
				cards: {
					[chunk.id]: {
						type: chunk.cardType,
						id: chunk.id,
						content: chunk.cardContent || '',
						isStream: chunk.cardInStream,
					},
				},
			};
		}
		if (chunk.text === '' || chunk.text === 'undefined' || !chunk.text) {
			console.log(
				'chunk.textchunk.textchunk.text:',
				typeof chunk.text,
				chunk.text
			);
		}

		return {
			id: chunk.messageId || '',
			conversation_id: chunk.conversationId || '',
			type: ServerMsgType.NORMAL,
			role: ChatMessageRole.ASSISTANT,
			content: chunk.text,
			overrideContent: chunk.overrideContent,
			msg_from: ClientMessageFrom.SERVER,
			venue_id: venueId || 0,
		};
	}

	async *doCreateMessage({
		curMessage,
		messages,
		conversationId,
		venueId,
	}: CreateMessageOptions): ApiStream {
		try {
			const lastMessage = await this.convertToVenueMsg(
				curMessage,
				venueId,
				conversationId
			);
			const response = await this.fetchReqOfStream({
				body: {
					...lastMessage,
				},
				abortController: this.abortController,
				method: 'POST',
				url: '/messages/msg',
			});
			if (!response?.ok || !response?.body) {
				if (!this.isAborted) {
					yield this.generageErrorServerMessage({
						content: '网络异常，请稍后重试',
						curMessageId: curMessage.id || '',
						conversationId: conversationId || '',
						venueId,
					});
				}
				return;
			}
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;
			while (!done && !this.isAborted) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;

				if (value) {
					const chunk = decoder.decode(value, { stream: !done });
					const lines = chunk.split('data:');
					for (const line of lines) {
						// console.log('line123123123123: with data', line);
						if (line === '[DONE]') {
							done = true;

							continue;
						}
						try {
							const res = JSON.parse(line);

							const item: ApiStreamChunk = res.data;
							if (!res.data) {
								continue;
							}

							const messageId = `${item?.messageId || ''}`;
							const oriMessageId = `${item?.originalMessageId || ''}`;
							const originalConversationId = `${
								item?.originalConversationId || ''
							}`;
							const newConversationId = `${item?.conversationId || ''}`;

							yield {
								serverMessage: this.getVenueServerMessageFromChunk(
									item,
									venueId
								),
								messageId: messageId,
								text: item.text,
								originalMessageId: oriMessageId,
								conversationId: newConversationId,
								originalConversationId: originalConversationId,
							};
						} catch (error) {
							console.warn('message what JSON 解析错误:', line, error);
						}
					}
				}
			}
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
}
