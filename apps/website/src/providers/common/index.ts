import {
	ChatMessageRole,
	ClientMessageFrom,
	ServerMsgType,
} from '../../common/constants/message';
import { TaskStatus } from '../../common/constants/task';
import {
	ConversationInfo,
	ConversationsPageInfo,
} from '../../common/interfaces/conversation';
import {
	UserClientMessage,
	AssistantClientMessage,
} from '../../common/interfaces/messages/chatMessages/client';
import { ConversationMessageType } from '../../common/interfaces/messages/chatMessages/interface';
import { ServerMessage } from '../../common/interfaces/messages/chatMessages/server';
import {
	ApiStream,
	ServerMessageChunk,
} from '../../common/interfaces/messages/stream';
import { SenceConfig } from '../../common/interfaces/senceConfig';
import { FullTaskInfo } from '../../common/interfaces/task';
import { RequestResult } from '@/apis/axios';
import { nanoid } from 'nanoid/non-secure';

export enum AgnoTaskSenceType {
	BATCH_APPLY_SHY_ACT = 'batch_apply_shy_act',
	CANCEL_SHY_ACT_APPLY = 'cancel_shy_act_apply',
	MULTI_SHY_ACT_APPLY = 'multi_shy_act_apply',
	QUERY_APPLY_SHY_ACT_RATE = 'query_apply_shy_act_rate',
	// QUERY_POI_APPLIED_ACTS = 'query_poi_applied_acts',
}

export type CreateMessageOptions = {
	conversationId?: string;
	curMessage: UserClientMessage | AssistantClientMessage;
	messages: ConversationMessageType[];
	venueId: number;
	saveMessageToState: (msg: ConversationMessageType) => void;
};

export enum FeedBackType {
	TASK = 'task',
	PLATFORM = 'platform',
}

export type FeedbackInfo = {
	id: number;
	feedback_score: number;
	feedback_content: string;
	feedback_time: string;
	feedback_user: string;
	task_id: number;
	feed_type: FeedBackType;
};

export type NewUITaskStepResult = {
	isComplated: boolean;
	isFailed: boolean;
	failedReason?: string;
	stepName: string;
	stepKey: string;
	startTime?: number;
	endTime?: number;
	disabled: boolean;
	stepResult?: any; // 存储请求结果日志
};
// 更新某一个步骤的 result
// task 表里的结构是：Record<string, stepResult> 其中 key 是：stepKey
export type FinishTaskStepParams = {
	task_step_results: NewUITaskStepResult;
	task_id: number;
	task_status: TaskStatus;
};

export abstract class ApiProvider {
	public abortController: AbortController | null = null;
	public isAborted: boolean = false;

	abstract baseUrl: string;
	abstract getFeedback(task_id: number): Promise<RequestResult<any>>;

	abstract intCsrfToken(): Promise<RequestResult<string>>;

	abstract finishTaskStep(params: FinishTaskStepParams): Promise<any>;

	abstract createFeedback(options: {
		taskId: number;
		feedScore: number;
		feedType: FeedBackType;
		feedContent: string;
	}): Promise<RequestResult<any>>;

	abstract getSenceConfigs(
		userMis: string
	): Promise<RequestResult<SenceConfig[]>>;
	abstract updateConversation(
		conversationId: string,
		options: {
			name?: string;
		}
	): Promise<RequestResult<ConversationInfo>>;
	abstract getConversation(
		conversationId: string
	): Promise<RequestResult<ConversationInfo>>;

	abstract createConversation(options?: {
		title?: string;
	}): Promise<RequestResult<ConversationInfo>>;
	abstract deleteConversation(
		conversationId: string
	): Promise<RequestResult<any>>;
	abstract getConversations(options?: {
		limit?: number;
		before?: any;
		after?: any;
	}): Promise<RequestResult<ConversationsPageInfo>>;
	abstract getConversationMessages(
		conversationId: string,
		options?: {
			limit?: number;
			before?: any;
			after?: any;
		}
	): Promise<RequestResult<ConversationInfo>>;
	public abortStream(): boolean {
		if (this.abortController) {
			this.abortController.abort();
			this.isAborted = true;
			return true;
		}
		return false;
	}

	generageErrorServerMessage({
		curMessageId,
		conversationId,
		content,
		venueId,
	}: {
		curMessageId: string;
		conversationId: string;
		content: string;
		venueId: number;
	}): ServerMessageChunk {
		const messageId = curMessageId || nanoid();
		const curConversationId = conversationId || nanoid();
		return {
			serverMessage: {
				role: ChatMessageRole.SYSTEM,
				content: content,
				type: ServerMsgType.ERROR,
				conversation_id: curConversationId,
				id: messageId,
				msg_from: ClientMessageFrom.SERVER,
				venue_id: venueId,
			},
			messageId: messageId,
			originalMessageId: curMessageId,
			conversationId: curConversationId,
			originalConversationId: curConversationId,
		};
	}

	createMessage(options: CreateMessageOptions): ApiStream {
		this.isAborted = false; // 添加一个标记

		this.abortController = new AbortController();

		this.abortController.signal.addEventListener('abort', () => {
			this.isAborted = true;
		});
		return this.doCreateMessage(options);
	}
	abstract doCreateMessage(options: CreateMessageOptions): ApiStream;

	protected async getCsrfToken() {
		const res = await fetch(`/common/getCsrfToken`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});
		const data = await res.json();
		return data;
	}

	protected async fetchReq({
		url,
		method,
		body,
		bodyType,
		baseUrl,
	}: {
		url: string;
		method: string;
		bodyType?: string;
		body?: Record<string, any>;
		baseUrl?: string;
	}) {
		// if (!this.csrfToken) {
		//     const res = await this.getCsrfToken();
		//     this.csrfToken = res.data;
		// }

		const options: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json',
				// 'X-CSRFToken': this.csrfToken,
			},
			credentials: 'include',
		};

		if (method !== 'GET' && body) {
			options.body = JSON.stringify(body);
		}
		let params = '';
		if (method === 'GET' && body && Object.keys(body).length > 0) {
			params = `?${new URLSearchParams(body).toString()}`;
		}

		const computedBaseUrl = baseUrl === undefined ? this.baseUrl : baseUrl;
		const res = await fetch(`${computedBaseUrl}${url}${params}`, options);
		return res.json();
	}

	protected async fetchReqOfStream({
		url,
		method,
		body,
		abortController,
		extraInfo,
	}: {
		url: string;
		method: string;
		abortController?: AbortController | null;
		body: Record<string, any>;
		extraInfo?: Record<string, any>;
	}) {
		const res = await fetch(`${this.baseUrl}${url}`, {
			method: method,
			signal: abortController?.signal,
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(body),
		});
		return res;
	}
}
