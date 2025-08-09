import {
	ChatGlobalStateEntity,
	ChatGlobalStateEntityOptions,
} from './chatGlobalStateEntity';
import { ChatGlobalState, ChatGlobalStateImpl } from './chatGlobalState';
import { Framework, Service } from '@/infra';
import { CommonDbService, DBService } from '../db/BaseDbService';
import { GlobalState } from './globalState';
import {
	ApiProvider,
	FeedbackInfo,
	FeedBackType,
	FinishTaskStepParams,
} from '../../providers/common';
import { UserClientMessage } from '../../common/interfaces/messages/chatMessages/client';
import { ServerMessageChunk } from '../../common/interfaces/messages/stream';
import { FullTaskInfo } from '../../common/interfaces/task';
import { ServerMessage } from '../../common/interfaces/messages/chatMessages/server';
import { ServerMessageCardType } from '../../common/constants/message';
import { Toast } from '@douyinfe/semi-ui';
import { ConversationMessageType } from '../../common/interfaces/messages/chatMessages/interface';
import {
	ProjectInfo,
	createProject,
	updateProject,
	queryProjects,
	deleteProject,
	archiveProject,
	copyProject,
	ProjectCreateParams,
	ProjectUpdateParams,
	ProjectQueryParams,
} from '../../apis/project';

export class ChatService extends Service {
	globalState = this.framework.createEntity(ChatGlobalStateEntity, [
		ChatGlobalState,
	]);
	constructor(
		private readonly dbService: DBService,
		private readonly apiProvider: ApiProvider
	) {
		super();
	}

	async finishTaskStep(params: FinishTaskStepParams) {
		const res = await this.apiProvider.finishTaskStep(params);
		if (res.success) {
			this.globalState.updateTaskDetail({
				status: params.task_status,
			});
		}
		return res;
	}

	stopStream() {
		return this.apiProvider.abortStream();
	}

	async getFeedback(taskId: number) {
		const res = await this.apiProvider.getFeedback(taskId);
		return res;
	}

	async createFeedback(options: {
		taskId: number;
		feedScore: number;
		feedType: FeedBackType;
		feedContent: string;
	}) {
		const res = await this.apiProvider.createFeedback(options);
		return res;
	}

	async getSenceConfigs(userMis: string) {
		console.log('getSenceConfigs userMis:', userMis);
		const res = await this.apiProvider.getSenceConfigs(userMis);
		if (res.success && res.data) {
			this.globalState.setSenceConfigs(res.data);
		} else {
			Toast.error({
				content: '获取场景配置失败',
			});
		}
	}
	getMessageById(msgId: string) {
		return this.globalState.getMessageById(msgId);
	}

	updateMessage(message: ServerMessage) {
		this.globalState.updateMessage(message);
	}

	async initCsrfToken() {
		const res = await this.apiProvider.intCsrfToken();
		console.log('resresres', res);

		if (res.success && res.data) {
			this.globalState.setCsrfToken(res.data);
		}
	}

	async getTaskDetail(taskId: number) {}

	setCurrentCardId(taskId: number | null) {
		this.globalState.setCurrentCardId(taskId);
	}

	setCurrentCardDetail(taskDetail: FullTaskInfo | null) {
		this.globalState.setCurrentCardDetail(taskDetail);
	}

	async getConversations(options: {
		limit?: number;
		before?: any;
		after?: any;
		venueId: number;
	}) {
		const conversations = await this.apiProvider.getConversations(options);
		if (conversations.success && conversations.data) {
			this.globalState.appendConversations(conversations.data);
			console.log('获取会话列表成功', conversations.data);
			return conversations.data;
		} else {
			Toast.error({
				content: '获取会话列表失败',
			});
			return undefined;
		}
	}

	async deleteConversation(id: string) {
		const provider = this.apiProvider;

		const res = await provider.deleteConversation(id);
		if (res.success) {
			this.globalState.deleteConversation(id);
		} else {
			Toast.error({
				content: '删除会话失败',
			});
		}
	}

	async updateConversationName(conversationId: string, name: string) {
		const res = await this.apiProvider.updateConversation(conversationId, {
			name,
		});
		if (res.success) {
			this.globalState.updateConversationName(conversationId, name);
		} else {
			Toast.error({
				content: '更新会话名称失败',
			});
		}
	}

	async getConversationMessagesByPage(
		conversationId: string,
		options: {
			limit?: number;
			before?: any;
			after?: any;
			venueId: number;
		}
	) {
		const result = await this.apiProvider.getConversationMessages(
			conversationId,
			options
		);
		if (result.success && result.data) {
			const beforeMessages = this.globalState.curConversation?.messages || [];
			const newMessages: ConversationMessageType[] = [];
			const newMessagesIds: number[] = [];
			[...(result.data.messages || []), ...beforeMessages].forEach((x) => {
				if (newMessagesIds.includes(Number(x.id))) {
					return;
				}
				newMessagesIds.push(Number(x.id));
				newMessages.push(x);
			});

			console.log(
				'newMessages:',
				result.data.messages || [],
				JSON.stringify(newMessages)
			);

			this.globalState.setCurConversation({
				...result.data,
				messages: newMessages,
				loaded: true,
			});
			return result.data;
		} else {
			Toast.error({
				content: `查询历史消息失败，请稍后重试`,
				// description: `查询历史消息失败，请稍后重试`,
				// variant: 'destructive',
			});
		}
		return undefined;
	}

	// 从外面获取路由上的会话 ID
	async sendNewMessage(
		content: string,
		{
			conversationIdInUrl,
			updateConversationId,
			venueId,
		}: {
			conversationIdInUrl?: string;
			venueId: number;
			updateConversationId: (conversationId: string) => void;
		}
	): Promise<void> {
		const curMsgContexts = this.globalState.curMsgContexts$.value || [];

		const start = new Date().getTime();
		console.log('sendNewMessage 000:', start);
		const { curConversationId, userMessage } = this.globalState.addUserMessage({
			message: content,
			context: [...curMsgContexts],
			conversationIdInUrl,
			overrideConversationName: true,
			venueId,
		});

		console.log('sendNewMessage 0001111:', new Date().getTime() - start);

		console.log(
			'sendNewMessage 111:',
			curMsgContexts,
			curConversationId,
			userMessage
		);

		this.globalState.clearCurrentStreamMsg();
		this.globalState.setIsWaiting(true);
		this.globalState.setCurSenceConfig(null);

		try {
			await this.sendStreamRequest({
				originalConversationId: curConversationId,
				userMessage,
				venueId,
				curConversationId: conversationIdInUrl || '',
				updateConversationId: updateConversationId,
			});
			const finalMsg = this.globalState.currentStreamMsg$.value;
			console.log('asdsasasaaadsadsa:', finalMsg);
			const cardIds = Object.keys(finalMsg?.cards || {});

			if (finalMsg) {
				this.globalState.addServerMessage({
					...finalMsg,
					isStreaming: false,
				});
				// 存储消息到服务器
			}
			this.globalState.clearCurrentStreamMsg();
			this.globalState.setIsWaiting(false);
			this.globalState.clearCurMsgContexts();
			if (cardIds.length > 0) {
				const card = (finalMsg?.cards || {})[cardIds[0]];
				if (card && card.type === ServerMessageCardType.TaskCard) {
					this.setCurrentCardId(card.detail.id);
				}
			}
		} catch (error) {
			console.error('发送消息失败:', error);
			this.globalState.setIsWaiting(false);
			this.globalState.clearCurrentStreamMsg();
		}
	}

	async sendStreamRequest({
		originalConversationId,
		userMessage,
		curConversationId,
		updateConversationId,
		venueId,
	}: {
		userMessage: UserClientMessage;
		curConversationId: string;
		originalConversationId: string;
		venueId: number;
		updateConversationId: (conversationId: string) => void;
	}) {
		const curConversation = this.globalState.curConversation;
		if (!curConversationId) {
			// 如果当前没有会话 ID，则使用路由上的会话 ID，这表示本地创建的 ID，消息返回后需要替换掉
			curConversationId = originalConversationId;
		}
		const provider = this.apiProvider;
		console.log('curCont12321321exts: user message:', userMessage);
		const stream = provider.createMessage({
			conversationId: curConversationId,
			curMessage: userMessage,
			venueId,
			messages: curConversation?.messages || [],
			saveMessageToState: (msg) => {
				this.globalState.addServerMessage(msg);
			},
		});
		let result = await stream.next();

		// 创建一个用于处理 abort 事件的 Promise
		const StreamAbortMsg = 'Stream aborted';
		const abortPromise = new Promise((_, reject) => {
			if (provider.abortController) {
				provider.abortController.signal.addEventListener('abort', () => {
					console.log('检测到 abort');
					reject(new Error(StreamAbortMsg));
				});
			}
		});

		const message = result.value as unknown as ServerMessageChunk;
		console.log(
			'aaasdsasasadsa:',
			result,
			originalConversationId,
			message,
			message?.conversationId
		);
		if (message) {
			this.globalState.updateUserMessageIdAndConversationId({
				originalMessageId: userMessage.id || '',
				// 后端返回的originalMessageId 才是之前对应的 local 哪一个的 id
				newMessageId: message.originalMessageId || '', // 服务端返回的消息 ID
				originalConversationId: originalConversationId,
				newConversationId: message.conversationId || '',
			});
			updateConversationId(message.conversationId || '');
			this.globalState.updateCurrentStreamMsg(message.serverMessage);
		}

		try {
			while (!result.done) {
				// 使用 Promise.race 同时处理流数据和 abort 事件
				result = (await Promise.race([
					stream.next(),
					abortPromise,
				])) as unknown as IteratorResult<ServerMessageChunk, any>;
				const message = result.value as unknown as ServerMessageChunk;
				console.log('message123123123123:', result, message);
				if (message) {
					this.globalState.updateCurrentStreamMsg(message.serverMessage);
				}
			}
		} catch (error: any) {
			if (error.message === StreamAbortMsg) {
				console.log('Stream 被终止');
			} else {
				console.error('发生其他错误:', error);
			}
		}
	}

	// 项目管理相关方法
	async getProjects(params: ProjectQueryParams) {
		try {
			const response = await queryProjects(params);
			if (response.success && response.data) {
				this.globalState.setProjects(response.data);
				return response.data;
			} else {
				Toast.error({
					content: '获取项目列表失败',
				});
				return undefined;
			}
		} catch (error) {
			console.error('获取项目列表失败:', error);
			Toast.error({
				content: '获取项目列表失败',
			});
			return undefined;
		}
	}

	async createNewProject(params: ProjectCreateParams) {
		try {
			const response = await createProject(params);
			if (response.success && response.data) {
				Toast.success({
					content: '项目创建成功',
				});
				// 刷新项目列表
				await this.getProjects({
					team_id: params.team_id,
					page_size: 100,
					page_num: 1,
				});
				return response.data;
			} else {
				Toast.error({
					content: '项目创建失败',
				});
				return undefined;
			}
		} catch (error) {
			console.error('创建项目失败:', error);
			Toast.error({
				content: '项目创建失败',
			});
			return undefined;
		}
	}

	async updateExistingProject(projectId: number, params: ProjectUpdateParams) {
		try {
			const response = await updateProject({
				project_id: projectId,
				project_data: params,
			});
			if (response.success && response.data) {
				Toast.success({
					content: '项目更新成功',
				});
				// 刷新项目列表
				await this.getProjects({
					team_id: this.globalState.curTeam$.value?.id,
					page_size: 100,
					page_num: 1,
				});
				return response.data;
			} else {
				Toast.error({
					content: '项目更新失败',
				});
				return undefined;
			}
		} catch (error) {
			console.error('更新项目失败:', error);
			Toast.error({
				content: '项目更新失败',
			});
			return undefined;
		}
	}

	async deleteExistingProject(projectId: number) {
		try {
			const response = await deleteProject({ project_id: projectId });
			if (response.success) {
				Toast.success({
					content: '项目删除成功',
				});
				// 刷新项目列表
				await this.getProjects({
					team_id: this.globalState.curTeam$.value?.id,
					page_size: 100,
					page_num: 1,
				});
				return true;
			} else {
				Toast.error({
					content: '项目删除失败',
				});
				return false;
			}
		} catch (error) {
			console.error('删除项目失败:', error);
			Toast.error({
				content: '项目删除失败',
			});
			return false;
		}
	}

	async archiveExistingProject(projectId: number) {
		try {
			const response = await archiveProject({ project_id: projectId });
			if (response.success && response.data) {
				Toast.success({
					content: '项目归档成功',
				});
				// 刷新项目列表
				await this.getProjects({
					team_id: this.globalState.curTeam$.value?.id,
					page_size: 100,
					page_num: 1,
				});
				return response.data;
			} else {
				Toast.error({
					content: '项目归档失败',
				});
				return undefined;
			}
		} catch (error) {
			console.error('归档项目失败:', error);
			Toast.error({
				content: '项目归档失败',
			});
			return undefined;
		}
	}

	async copyExistingProject(projectId: number, name: string) {
		try {
			const response = await copyProject({ project_id: projectId, name });
			if (response.success && response.data) {
				Toast.success({
					content: '项目复制成功',
				});
				// 刷新项目列表
				await this.getProjects({
					team_id: this.globalState.curTeam$.value?.id,
					page_size: 100,
					page_num: 1,
				});
				return response.data;
			} else {
				Toast.error({
					content: '项目复制失败',
				});
				return undefined;
			}
		} catch (error) {
			console.error('复制项目失败:', error);
			Toast.error({
				content: '项目复制失败',
			});
			return undefined;
		}
	}

	setCurrentProject(project: ProjectInfo | null) {
		this.globalState.setCurProject(project);
	}
}

export function configureChatGlobalStateModule(
	framework: Framework,
	options: ChatGlobalStateEntityOptions
) {
	framework
		.service(ChatService, (f) => {
			return new ChatService(f.get(CommonDbService), options.provider);
		})
		.entity(ChatGlobalStateEntity, (f) => {
			return new ChatGlobalStateEntity(f.get(ChatGlobalState), options);
		})
		.impl(ChatGlobalState, ChatGlobalStateImpl, [GlobalState]);
}
