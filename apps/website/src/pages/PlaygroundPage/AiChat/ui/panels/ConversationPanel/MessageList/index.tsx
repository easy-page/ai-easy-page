import {
	ClientMessageFrom,
	ServerMsgType,
	ChatMessageRole,
} from '@/common/constants/message';
import {
	AssistantClientMessage,
	UserClientMessage,
	UserShellClientMessage,
	ToolGroupClientMessage,
	QuitClientMessage,
	ModelStatsClientMessage,
	ToolStatsClientMessage,
	StatsClientMessage,
	AboutClientMessage,
	ErrorClientMessage,
	InfoClientMessage,
	ModelContentClientMessage,
} from '@/common/interfaces/messages/chatMessages/client';
import { ConversationMessageType } from '@/common/interfaces/messages/chatMessages/interface';
import {
	ServerMessage,
	ServerRecommandMessage,
} from '@/common/interfaces/messages/chatMessages/server';
import { getQueryString } from '@/common/utils/url';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { isLocalId } from '@/routers/toChat';
import { ChatService } from '@/services/chatGlobalState';
import { NavItemEnum } from '@/services/chatGlobalState/constant';
import { Spinner } from '@/views/aiChat/baseUi/components/spinner';
import { AssistantMessage } from '@/views/aiChat/components/AssistantMessage';
import { ChatClientMessage } from '@/views/aiChat/components/ChatMessage';
import { StreamingMessage } from '@/views/aiChat/components/StreamMessage';
import { UserShellMessage } from '@/views/aiChat/components/UserShellMessage';
import { ToolGroupMessage } from '@/views/aiChat/components/ToolGroupMessage';
import { StatsMessage } from '@/views/aiChat/components/StatsMessage';
import { ModelStatsMessage } from '@/views/aiChat/components/ModelStatsMessage';
import { ToolStatsMessage } from '@/views/aiChat/components/ToolStatsMessage';
import { QuitMessage } from '@/views/aiChat/components/QuitMessage';
import { AboutMessage } from '@/views/aiChat/components/AboutMessage';
import { ErrorMessage } from '@/views/aiChat/components/ErrorMessage';
import { InfoMessage } from '@/views/aiChat/components/InfoMessage';
import { ModelContentMessage } from '@/views/aiChat/components/ModelContentMessage';
import { RecommendMessage } from '@/views/aiChat/components/RecommendMessage';
import { Toast } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThinkingLoading } from '@/views/aiChat/components/ThinkingLoading';
const PAGE_SIZE = 10;
export const MessageList = () => {
	const chatService = useService(ChatService);

	const chatId = getQueryString('chatId');
	const curConversation = useObservable(
		chatService.globalState.curConversation$,
		null
	);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const messages = curConversation?.messages || [];
	console.log('curConversation', curConversation, messages);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);
	const chatMessagesRef = useRef<HTMLDivElement>(null);
	const [loadingMore, setLoadingMore] = useState(false);

	useEffect(() => {
		if (chatMessagesRef.current) {
			setTimeout(() => {
				const element = chatMessagesRef.current;
				if (element) {
					element.scrollTop = element.scrollHeight;
					chatMessagesRef.current.scrollTop = element.scrollHeight;
				}
			}, 100);
		}
	}, [isWaiting]);

	// 是否组件初始化完成，用于防止多次加载
	const initRef = useRef(false);
	const showMessages = curConversation && messages.length > 0;

	const loadMoreMessages = useCallback(async () => {
		if (!chatId) return;

		try {
			setLoadingMore(true);
			const result = await chatService.getConversationMessagesByPage(chatId, {
				limit: PAGE_SIZE,
				before: curConversation?.nextBefore,
				venueId: curVenue?.id || -1,
			});

			// 保存当前距离底部的距离
			// const element = chatMessagesRef.current;
			// if (element) {
			//     const distanceFromBottom =
			//         element.scrollHeight - element.scrollTop - element.clientHeight;

			//     // 加载新消息后维持相同的距离
			//     setTimeout(() => {
			//         if (element) {
			//             // 新内容会增加滚动高度，我们需要保持相同的距离
			//             element.scrollTop =
			//                 element.scrollHeight - element.clientHeight - distanceFromBottom;
			//         }
			//     }, 100);
			// }
		} catch (error) {
			console.error('加载更多消息失败:', error);
			Toast.error({
				content: '无法加载更多历史消息',
				// description: '无法加载更多历史消息',
				// variant: 'destructive',
			});
		} finally {
			setLoadingMore(false);
		}
	}, [[chatId, curConversation, chatService]]);

	const debouncedLoadMoreMessages = useCallback(
		debounce(async (e) => {
			const element = e.target as HTMLDivElement;
			console.log(
				'debouncedLoadMoreMessages===> 1111111',
				curConversation?.hasMore
			);
			if (
				!chatId ||
				!curConversation ||
				curConversation.hasMore === false ||
				curConversation?.hasMore === undefined
			)
				return;

			// 在使用 flex-col-reverse 的情况下，计算滚动到顶部的距离
			// 0 表示已经滚动到了底部（在反转布局中是最新消息），而越大的值表示越靠近顶部（在反转布局中是最早的消息）
			const distanceFromBottom =
				element.scrollHeight - element.clientHeight + element.scrollTop;
			console.log('debouncedLoadMoreMessages Scroll position:', {
				scrollTop: element.scrollTop,
				scrollHeight: element.scrollHeight,
				clientHeight: element.clientHeight,
				distanceFromBottom: distanceFromBottom,
			});

			// 当滚动接近底部时(在反转布局中是最早的消息)
			if (distanceFromBottom < 50 && !loadingMore) {
				setLoadingMore(true);
				try {
					await loadMoreMessages();
				} finally {
					setLoadingMore(false);
				}
			}
		}, 300),
		[curConversation?.hasMore, loadingMore, loadMoreMessages, isWaiting]
	);

	useEffect(() => {
		// 新会话切到具体的 chatId 以及会话历史上切换，也会执行这个
		console.log('chatIdchatId:', chatId, curConversation);
		if (
			chatId &&
			!isLocalId(chatId) &&
			curConversation &&
			!curConversation.loaded
		) {
			console.log(
				'debouncedLoadMoreMessages===> 2222',
				chatId,
				curConversation
			);
			loadMoreMessages();
		}
	}, [chatId, curConversation]);

	useEffect(() => {
		// 新会话切换到这里的时候，会执行一次；刷新这个页面也会执行这个；
		const initConversation = async () => {
			const chatId = getQueryString('chatId');
			console.log('initConversation res12321212312312313:', chatId);
			if (initRef.current) return;
			initRef.current = true;

			if (chatId && !isLocalId(chatId)) {
				console.log('initConversation re222s12321212312312313');
				setLoadingMore(true);
				const res = await chatService.getConversationMessagesByPage(chatId, {
					limit: PAGE_SIZE,
					venueId: curVenue?.id || -1,
				});
				console.log('initConversation res12321213', res);
				setLoadingMore(false);
			}
		};
		initConversation();
	}, []);

	const renderMessage = useCallback(
		(message: ConversationMessageType, isLastMsg: boolean) => {
			let messageNode;

			// 根据消息来源和角色类型渲染不同的组件
			switch (message.msg_from) {
				case ClientMessageFrom.SERVER:
					if (message.type === ServerMsgType.NORMAL) {
						messageNode = (
							<AssistantMessage
								key={message.id}
								message={message as ServerMessage}
								isLastMsg={isLastMsg}
							/>
						);
					} else if (message.type === ServerMsgType.RECOMMAND) {
						messageNode = (
							<RecommendMessage
								key={message.id}
								message={message as ServerRecommandMessage}
							/>
						);
					}
					break;
				case ClientMessageFrom.CLIENT:
					// 根据角色类型渲染不同的客户端消息组件
					switch (message.role) {
						case ChatMessageRole.USER:
							messageNode = (
								<ChatClientMessage
									key={message.id}
									message={message as UserClientMessage}
								/>
							);
							break;
						case ChatMessageRole.ASSISTANT:
							messageNode = (
								<AssistantMessage
									key={message.id}
									message={message as ServerMessage}
								/>
							);
							break;
						case ChatMessageRole.USER_SHELL:
							messageNode = (
								<UserShellMessage
									key={message.id}
									message={message as UserShellClientMessage}
								/>
							);
							break;
						case ChatMessageRole.TOOL_GROUP:
							messageNode = (
								<ToolGroupMessage
									key={message.id}
									message={message as ToolGroupClientMessage}
								/>
							);
							break;
						case ChatMessageRole.QUIT:
							messageNode = (
								<QuitMessage
									key={message.id}
									message={message as QuitClientMessage}
								/>
							);
							break;
						case ChatMessageRole.MODEL_STATS:
							messageNode = (
								<ModelStatsMessage
									key={message.id}
									message={message as ModelStatsClientMessage}
								/>
							);
							break;
						case ChatMessageRole.TOOL_STATS:
							messageNode = (
								<ToolStatsMessage
									key={message.id}
									message={message as ToolStatsClientMessage}
								/>
							);
							break;
						case ChatMessageRole.STATS:
							messageNode = (
								<StatsMessage
									key={message.id}
									message={message as StatsClientMessage}
								/>
							);
							break;
						case ChatMessageRole.ABOUT:
							messageNode = (
								<AboutMessage
									key={message.id}
									message={message as AboutClientMessage}
								/>
							);
							break;
						case ChatMessageRole.ERROR:
							messageNode = (
								<ErrorMessage
									key={message.id}
									message={message as ErrorClientMessage}
								/>
							);
							break;
						case ChatMessageRole.INFO:
							messageNode = (
								<InfoMessage
									key={message.id}
									message={message as InfoClientMessage}
								/>
							);
							break;
						case ChatMessageRole.MODEL_CONTENT:
							messageNode = (
								<ModelContentMessage
									key={message.id}
									message={message as ModelContentClientMessage}
								/>
							);
							break;
						default:
							messageNode = (
								<ChatClientMessage
									key={message.id}
									message={
										message as UserClientMessage | AssistantClientMessage
									}
								/>
							);
							break;
					}
					break;
				default:
					messageNode = (
						<div key={message.id} className="text-gray-500 text-sm">
							未知消息类型: {message.role}
						</div>
					);
					break;
			}

			return <div key={message.id}>{messageNode}</div>;
		},
		[]
	);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className={classNames(
					'flex flex-col-reverse gap-2 w-full select-text overflow-auto flex-1 relative'
				)}
				ref={(ref) => {
					(chatMessagesRef as any).current = ref;
				}}
				key={`conversation_${curConversation?.conversationId}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				onScroll={debouncedLoadMoreMessages}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.15 }}
			>
				{isWaiting && <ThinkingLoading />}
				<StreamingMessage />

				{[...messages].reverse().map((message, idx) => {
					console.log(
						'message121312321:',
						JSON.stringify((message as any).cards)
					);
					return renderMessage(message, idx === 0);
					// return <div key={message.id}>{message.id}</div>;
				})}

				{loadingMore && (
					<div className="sticky bottom-0 left-0 w-full flex justify-center py-2  backdrop-blur-sm z-10">
						<Spinner className="h-4 w-4" />
						<span className="text-xs text-foreground-secondary ml-2">
							加载更多消息...
						</span>
					</div>
				)}

				{curConversation?.loaded &&
					!curConversation?.hasMore &&
					!loadingMore &&
					messages.length > PAGE_SIZE && (
						<div className="sticky bottom-0 left-0 w-full flex justify-center py-2 text-xs text-foreground-secondary">
							没有更多消息了
						</div>
					)}
			</motion.div>
		</AnimatePresence>
	);
};
