import { ChatGlobalState } from './chatGlobalState';
import { nanoid } from 'nanoid/non-secure';
import { Entity } from '../../infra';
import { NavItemEnum } from './constant';
import { LiveData } from '../../infra/liveData';
import { ApiProvider, FinishTaskStepParams } from '../../providers/common';
import {
	ChatMessageContext,
	ChatMessageContextType,
} from '../../common/interfaces/messages/chatMessages/context';
import {
	ConversationInfo,
	ConversationsPageInfo,
} from '../../common/interfaces/conversation';
import {
	AssistantClientMessage,
	UserClientMessage,
} from '../../common/interfaces/messages/chatMessages/client';
import {
	ChatMessageRole,
	ClientMessageFrom,
} from '../../common/constants/message';
import { ServerMessage } from '../../common/interfaces/messages/chatMessages/server';
import { isLocalId } from '../../routers/toChat';
import { FullTaskInfo } from '../../common/interfaces/task';
import { SenceConfig } from '../../common/interfaces/senceConfig';
import { NavItemBaseInfo, UserInfo } from './interface';
import { getQueryString } from '../../common/utils/url';
import { ConversationMessageType } from '../../common/interfaces/messages/chatMessages/interface';
import { VenueInfo } from '../../apis/venue';
import { TeamInfo } from '../../apis/team';

export const MAX_NAME_LENGTH = 10;
const MAX_CONVERSATION_COUNT = 8;

export type ChatGlobalStateEntityOptions = {
	provider: ApiProvider;
};

/**
 * - 新对话是打开对话页面，但是没有任何会话历史
 * - 点击发送消息后
 * 		- 创建会话，并发送第一条消息，
 * 		- 历史消息里增加一个，
 * 		- 菜单切换到历史消息
 *    - 设置当前会话 ID
 */

export type CurConversation = ConversationInfo & {
	loaded: boolean; // 是否初始化了消息
	hasMore?: boolean; // 是否还有更多消息
	nextAfter?: number; // 下一页的游标
	nextBefore?: number; // 上一页的游标
};

// 面包屑定义
export interface Breadcrumb {
	label: string;
	path: string;
}

// 模块类型
export enum ModuleType {
	Venue = 'venue',
	Team = 'team',
	Material = 'material',
	Activity = 'activity',
	Setting = 'setting',
}

export type VenueListInfo = {
	data: VenueInfo[];
	total: number;
	pageSize: number;
	pageNo: number;
};

export class ChatGlobalStateEntity extends Entity {
	/** 当前是否在输入中 */
	isWaiting$: LiveData<boolean> = new LiveData<boolean>(false);
	currentCardId$: LiveData<number | null> = new LiveData<number | null>(null);
	curNavItem$: LiveData<string> = new LiveData<string>(NavItemEnum.NewChat);
	/** 用于流式输出渲染，输出结束后放到数组中，否则单独流式渲染避免刷新问题 */
	currentStreamMsg$: LiveData<ServerMessage | null> =
		new LiveData<ServerMessage | null>(null);

	isEmptyInput$: LiveData<boolean> = new LiveData<boolean>(true);

	curTeam$: LiveData<TeamInfo | null> = new LiveData<TeamInfo | null>(null);
	userTeams$: LiveData<TeamInfo[]> = new LiveData<TeamInfo[]>([]);

	curVenue$: LiveData<VenueInfo | null> = new LiveData<VenueInfo | null>(null);
	venues$: LiveData<VenueListInfo | null> = new LiveData<VenueListInfo | null>(
		null
	);

	csrfToken$: LiveData<string> = new LiveData<string>('');

	/** 自定义导航栏 */
	customNavItems$: LiveData<NavItemBaseInfo[]> = new LiveData<
		NavItemBaseInfo[]
	>([]);

	userInfo$: LiveData<UserInfo | null> = new LiveData<UserInfo | null>(null);

	conversationsPageInfo$: LiveData<ConversationsPageInfo> =
		new LiveData<ConversationsPageInfo>({
			hasMore: true,
			nextAfter: '',
			nextBefore: '',
			items: [],
		});
	curMsgContexts$: LiveData<ChatMessageContext[]> = new LiveData<
		ChatMessageContext[]
	>([]);
	curConversation$: LiveData<CurConversation | null> =
		new LiveData<CurConversation | null>(null);
	conversations$: LiveData<ConversationInfo[]> = new LiveData<
		ConversationInfo[]
	>([]);

	senceConfigs$: LiveData<SenceConfig[]> = new LiveData<SenceConfig[]>([]);
	curSenceConfig$: LiveData<SenceConfig | null> =
		new LiveData<SenceConfig | null>(null);
	isLeftNavOpen$: LiveData<boolean> = new LiveData<boolean>(true);
	isRightPanelOpen$: LiveData<boolean> = new LiveData<boolean>(false);

	/** 当前页面是否为只读状态 */
	isReadOnly$: LiveData<boolean> = new LiveData<boolean>(
		getQueryString('readOnly') === 'true'
	);

	/** 当前展开的任务详情 */
	currentCardDetail$: LiveData<FullTaskInfo | null> =
		new LiveData<FullTaskInfo | null>(null);

	/** 各模块的面包屑 */
	breadcrumbsMap$: LiveData<Record<ModuleType, Breadcrumb[]>> = new LiveData<
		Record<ModuleType, Breadcrumb[]>
	>({
		[ModuleType.Venue]: [],
		[ModuleType.Team]: [],
		[ModuleType.Material]: [],
		[ModuleType.Activity]: [],
		[ModuleType.Setting]: [],
	});

	/** 当前活动模块 */
	activeModule$: LiveData<ModuleType | null> = new LiveData<ModuleType | null>(
		null
	);

	constructor(
		private readonly chatGlobalState: ChatGlobalState,
		options: ChatGlobalStateEntityOptions
	) {
		super();
	}

	setCurTeam(team: TeamInfo | null) {
		this.curTeam$.next(team);
	}

	setCurVenue(venue: VenueInfo | null) {
		this.curVenue$.next(venue);
	}

	setVenues(venues: VenueListInfo | null) {
		this.venues$.next(venues);
	}

	setUserTeams(teams: TeamInfo[]) {
		this.userTeams$.next(teams);
		console.log('this.curTeam$.value:', this.curTeam$.value, teams);
		if (!this.curTeam$.value) {
			this.curTeam$.next(teams[0]);
		}
	}

	setCsrfToken(csrfToken: string) {
		console.log('setCsrfToken', csrfToken);

		this.csrfToken$.next(csrfToken);
	}

	setIsEmptyInput(isEmpty: boolean) {
		this.isEmptyInput$.next(isEmpty);
	}

	setCustomNavItems(customNavItems: NavItemBaseInfo[]) {
		this.customNavItems$.next(customNavItems);
	}

	setUserInfo(userInfo: UserInfo | null) {
		this.userInfo$.next(userInfo);
	}

	/**
	 * 设置当前活动模块
	 */
	setActiveModule(moduleType: ModuleType) {
		this.activeModule$.next(moduleType);
	}

	/**
	 * 设置指定模块的面包屑
	 */
	setModuleBreadcrumbs(moduleType: ModuleType, breadcrumbs: Breadcrumb[]) {
		const currentMap = { ...this.breadcrumbsMap$.value };
		currentMap[moduleType] = breadcrumbs;
		this.breadcrumbsMap$.next(currentMap);
	}

	/**
	 * 获取当前活动模块的面包屑
	 */
	getCurrentBreadcrumbs(): Breadcrumb[] {
		const activeModule = this.activeModule$.value;
		if (!activeModule) return [];
		return this.breadcrumbsMap$.value[activeModule] || [];
	}

	updateMessage(message: UserClientMessage | ServerMessage) {
		const conversation = this.curConversation;

		if (!conversation) return;

		const index = conversation.messages?.findIndex(
			(item) => item.id === message.id
		);
		const newMessages = [...(conversation.messages || [])];

		if (index === -1) {
			newMessages.push(message);
		} else {
			newMessages[index] = message;
		}

		const updatedConversation = {
			...conversation,
			messages: newMessages,
			updatedAt: new Date().toISOString(),
		};
		this.addOrUpdateConversation(
			updatedConversation,
			updatedConversation.conversationId || ''
		);
		return conversation;
	}

	addConversationsToState(conversation: ConversationInfo) {
		const curVal = this.conversations$.getValue() || [];

		const existingIndex = curVal.findIndex(
			(conv) => conv.conversationId === conversation.conversationId
		);

		if (existingIndex !== -1) {
			// 更新现有对话
			console.log('1111111111');

			curVal[existingIndex] = conversation;
		} else {
			console.log('1111122222');
			// 添加新对话
			curVal.unshift(conversation);
			// 删除最后面一个
			if (curVal.length > MAX_CONVERSATION_COUNT) {
				curVal.pop();
			}
		}
		// console.log('curVal', JSON.stringify(curVal));
		this.conversations$.next([...curVal]);
	}

	getMessageById(id: string) {
		return this.curConversation?.messages.find((item) => item.id === id);
	}

	setCurrentCardId(cardId: number | null) {
		this.currentCardId$.next(cardId);
		if (cardId) {
			this.setIsRightPanelOpen(true);
			this.setIsLeftNavOpen(false);
		} else {
			this.setIsRightPanelOpen(false);
			this.setCurrentCardDetail(null);
		}
	}

	updateTaskDetail(cardDetail: Partial<FullTaskInfo>) {
		const curDetail = this.currentCardDetail$.value || {};
		this.currentCardDetail$.next({
			...curDetail,
			...cardDetail,
		} as FullTaskInfo);
	}

	setCurrentCardDetail(cardDetail: FullTaskInfo | null) {
		this.currentCardDetail$.next(cardDetail);
	}

	updateConversationName(conversationId: string, name: string) {
		const curVal = this.conversationsPageInfo$.value.items || [];
		const curConversation = this.curConversation$.value;
		const updatedConversation = curVal.find(
			(item) => item.conversationId === conversationId
		);
		if (updatedConversation) {
			updatedConversation.displayName = name;
		}
		this.conversationsPageInfo$.next({
			...this.conversationsPageInfo$.value,
			items: curVal,
		});
		this.setCurConversation({
			...curConversation,
			conversationId: curConversation?.conversationId || '',
			displayName: updatedConversation?.displayName || '',
			messages: curConversation?.messages || [],
			createdAt: curConversation?.createdAt || '',
			updatedAt: curConversation?.updatedAt || '',
			loaded: true,
		});
	}

	deleteConversation(id: string) {
		const curVal = this.conversationsPageInfo$.value.items || [];
		const newConversations = curVal.filter(
			(item) => item.conversationId !== id
		);
		this.conversationsPageInfo$.next({
			...this.conversationsPageInfo$.value,
			items: newConversations,
		});
	}

	get curConversation(): ConversationInfo | null {
		return this.curConversation$.value;
	}

	setCurConversation(conversation: CurConversation | null) {
		this.curConversation$.next(conversation);
	}

	setCurrentStreamMsg(message: ServerMessage) {
		this.currentStreamMsg$.next(message);
	}

	clearCurrentStreamMsg() {
		this.currentStreamMsg$.next(null);
	}

	updateCurrentStreamMsg(message: ServerMessage) {
		const curVal = this.currentStreamMsg$.value || ({} as ServerMessage);
		const newCards = { ...(curVal.cards || {}) };
		Object.keys(message.cards || {}).forEach((cardId) => {
			if (newCards[cardId]) {
				newCards[cardId] = {
					...newCards[cardId],
					detail: {
						...(newCards[cardId].detail || {}),
						...(message.cards?.[cardId].detail || {}),
					},
				};
			} else if (message.cards?.[cardId]) {
				newCards[cardId] = message.cards?.[cardId];
			}
		});

		console.log(
			'cards===>: newCardsnewCards:',
			newCards,
			JSON.stringify(message.cards, null, 2)
		);

		this.currentStreamMsg$.next({
			...curVal,
			...message,
			cards: newCards,
			isStreaming: true,
			content: message.overrideContent
				? message.content
				: (curVal?.content || '') + message.content,
		});
	}

	addUserMessage({
		message,
		context,
		overrideConversationName,
		conversationIdInUrl,
		venueId,
	}: {
		message: string;
		context: ChatMessageContext[];
		overrideConversationName?: boolean;
		conversationIdInUrl?: string;
		venueId: number;
	}): {
		curConversationId: string;
		userMessage: UserClientMessage;
	} {
		let conversation = this.curConversation;
		if (!conversation) {
			conversation = {
				conversationId: conversationIdInUrl || '',
				displayName: message.slice(0, MAX_NAME_LENGTH),
				messages: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
		}

		const userMessage: UserClientMessage = {
			id: nanoid(),
			role: ChatMessageRole.USER,
			content: message,
			context,
			conversation_id: conversation.conversationId,
			msg_from: ClientMessageFrom.CLIENT,
			venue_id: venueId,
		};
		console.log(
			'conversation.displayName:',
			(conversation.messages || []).length
		);
		const updatedConversation = {
			...conversation,
			messages: [...(conversation.messages || []), userMessage],
			updatedAt: new Date().toISOString(),
		};

		console.log('updatedConversationupdatedConversation:', updatedConversation);

		this.addOrUpdateConversation(
			updatedConversation,
			conversationIdInUrl || ''
		);
		return {
			curConversationId: updatedConversation.conversationId,
			userMessage,
		};
	}

	addServerMessage(serverMessage: ConversationMessageType) {
		const conversation = this.curConversation;
		if (!conversation) return;
		const updatedConversation = {
			...conversation,
			messages: [...(conversation.messages || []), serverMessage],
			updatedAt: new Date().toISOString(),
		};

		this.addOrUpdateConversation(
			updatedConversation,
			conversation.conversationId || ''
		);
	}

	updateUserMessageIdAndConversationId({
		originalConversationId,
		newConversationId,
		originalMessageId,
		newMessageId,
	}: {
		originalMessageId: string;
		newMessageId: string;
		originalConversationId: string;
		newConversationId: string;
	}) {
		const conversation = (this.conversationsPageInfo$.value.items || []).find(
			(conv) => conv.conversationId === originalConversationId
		);

		if (!conversation) return;
		console.log('updateUserMessageIdAndConversationId:', conversation);

		const updatedConversation = {
			...conversation,
			messages: conversation.messages?.map((message) =>
				message.id === originalMessageId
					? { ...message, id: newMessageId }
					: message
			),
			conversationId: newConversationId,
		};
		this.addOrUpdateConversation(updatedConversation, originalConversationId);
	}

	appendConversations(conversations: ConversationsPageInfo) {
		// 判断是否有新的会话数据
		if (!conversations.items || conversations.items.length === 0) {
			// 如果没有新数据，只更新hasMore、nextBefore和nextAfter
			this.conversationsPageInfo$.next({
				...this.conversationsPageInfo$.value,
				hasMore: conversations.hasMore,
				nextBefore: conversations.nextBefore,
				nextAfter: conversations.nextAfter,
			});
			return;
		}

		// 获取当前会话列表
		const currentItems = this.conversationsPageInfo$.value.items || [];
		// 获取新会话列表的最后一个元素
		const newItemsLast = conversations.items[conversations.items.length - 1];

		// 检查当前列表是否有元素
		if (currentItems.length > 0) {
			// 获取当前列表的最后一个元素
			const currentItemsLast = currentItems[currentItems.length - 1];

			// 如果最后一个元素的ID相同，则说明有重复
			if (currentItemsLast.conversationId === newItemsLast.conversationId) {
				console.log('检测到重复会话，跳过添加');
				return;
			}
		}

		// 没有重复，正常添加新会话
		this.conversationsPageInfo$.next({
			...this.conversationsPageInfo$.value,
			items: [...currentItems, ...conversations.items],
			hasMore: conversations.hasMore,
			nextBefore: conversations.nextBefore,
			nextAfter: conversations.nextAfter,
		});
	}
	addOrUpdateConversation(
		conversation: ConversationInfo,
		originalConversationId: string
	) {
		if (!conversation.conversationId) {
			// 不应该存在这种情况
			console.warn('conversationId为空，跳过添加');
			return;
		}
		if (isLocalId(conversation.conversationId)) {
			// 如果我要更改的就是一个 local，那只可能是新建会话的时候
			this.conversationsPageInfo$.next({
				...this.conversationsPageInfo$.value,

				items: [conversation, ...this.conversationsPageInfo$.value.items],
			});
		} else {
			this.conversationsPageInfo$.next({
				...this.conversationsPageInfo$.value,
				items: this.conversationsPageInfo$.value.items.map((conv) => {
					if (conv.conversationId === originalConversationId) {
						return {
							...conv,
							...conversation,
						};
					}
					return conv;
				}),
			});
		}

		this.setCurConversation({ ...conversation, loaded: true });
	}
	addCurMsgContext(msgContext: ChatMessageContext) {
		this.curMsgContexts$.next([...this.curMsgContexts$.value, msgContext]);
	}

	updateCurMsgContext(msgContexts: ChatMessageContext[]) {
		this.curMsgContexts$.next(msgContexts);
	}

	removeCurMsgContext(contextId: string) {
		this.curMsgContexts$.next(
			this.curMsgContexts$.value.filter((item) => item.id !== contextId)
		);
	}

	clearCurMsgContexts() {
		this.curMsgContexts$.next([]);
	}

	setIsWaiting(isWaiting: boolean) {
		this.isWaiting$.next(isWaiting);
	}

	setCurSenceConfig(curSenceConfig: SenceConfig | null) {
		if (curSenceConfig) {
			this.updateCurMsgContext([
				{
					type: ChatMessageContextType.SENCE,
					id: curSenceConfig.id.toString(),
					senceId: curSenceConfig.senceId,
					senceName: curSenceConfig?.name || '',
					senceDesc: curSenceConfig?.description || '',
				},
			]);
		} else {
			// 如果取消场景的话，就取消所有场景输入上线
			this.clearCurMsgContexts();
		}
		this.curSenceConfig$.next(curSenceConfig);
	}

	setSenceConfigs(senceConfigs: SenceConfig[]) {
		this.senceConfigs$.next(senceConfigs);
	}

	setCurNavItem(curNavItem: string) {
		this.curNavItem$.next(curNavItem);
	}

	setIsLeftNavOpen(isLeftNavOpen: boolean) {
		this.isLeftNavOpen$.next(isLeftNavOpen);
	}

	setIsRightPanelOpen(isRightPanelOpen: boolean) {
		this.isRightPanelOpen$.next(isRightPanelOpen);
	}

	setIsReadOnly(isReadOnly: boolean) {
		this.isReadOnly$.next(isReadOnly);
	}
}
