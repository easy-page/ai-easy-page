import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { IconClock, PlusIcon } from '../../components/Icons';
import { NavItemEnum } from '@/services/chatGlobalState/constant';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { Modal, Tooltip } from '@douyinfe/semi-ui';
import { HistoryItem, HistoryItemOp, HistoryItemProps } from './HistoryItem';
import {
	ConversationInfo,
	ConversationsPageInfo,
} from '@/common/interfaces/conversation';
import { useObservable } from '@/hooks/useObservable';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { RouterNames } from '@/routers/constant';
import { getChatUrl, toChat } from '@/routers/toChat';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

const historyStyles = {
	container: 'flex-1 overflow-y-auto',
	header: 'px-4 text-gray-500 text-sm',
	list: 'px-2',

	loading: 'text-center py-4 text-sm text-gray-500',
};
export type HistoryListProps = {
	onHistoryItemClick: (
		chatId: string,
		options: { navigate: NavigateFunction }
	) => void;
};
export const HistoryList = ({ onHistoryItemClick }: HistoryListProps) => {
	const chatService = useService(ChatService);
	const [loading, setLoading] = useState(false);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	console.log('loading more history11:', curVenue);
	const navigate = useNavigate();
	const conversationsPageInfo = useObservable(
		chatService.globalState.conversationsPageInfo$,
		{
			hasMore: true,
			nextAfter: '',
			nextBefore: '',
			items: [],
		}
	);
	const loadingRef = useRef<HTMLDivElement>(null);
	const loadingStateRef = useRef(false);

	const loadMoreHistory = useCallback(
		async (venueId) => {
			const hasMore = conversationsPageInfo.hasMore;

			// 使用ref来跟踪加载状态，避免多次调用
			if (loadingStateRef.current || loading || !hasMore || !venueId) return;

			loadingStateRef.current = true;
			setLoading(true);

			try {
				console.log('loading more history:', curVenue);
				const newItems = await chatService.getConversations({
					limit: 10,
					before: conversationsPageInfo.nextBefore,
					venueId: venueId,
				});

				if (!newItems || (newItems.items && newItems.items.length === 0)) {
					chatService.globalState.conversationsPageInfo$.next({
						...conversationsPageInfo,
						hasMore: false,
					});
				}
			} catch (error) {
				console.error('Failed to load history:', error);
				chatService.globalState.conversationsPageInfo$.next({
					...conversationsPageInfo,
					hasMore: false,
				});
			} finally {
				loadingStateRef.current = false;
				setLoading(false);
			}
		},
		[loading, conversationsPageInfo.hasMore, conversationsPageInfo.nextBefore]
	);

	useIntersectionObserver({
		target: loadingRef,
		onIntersect: loadMoreHistory,
		enabled: !loading && conversationsPageInfo.hasMore && Boolean(curVenue?.id),
		threshold: 0.1,
		venueId: curVenue?.id || -1,
	});

	console.log('conversationsPageInfo', loading, conversationsPageInfo);

	return (
		<div className={historyStyles.container}>
			<div className="group relative flex items-center pr-2 justify-between  py-2">
				<div className={historyStyles.header}>历史对话</div>
				<div className="opacity-0 group-hover:opacity-100 transition-opacity">
					{/** TODO: 暂时屏蔽查看对话全部 */}
					{/* <Tooltip content="查看全部">
                        <button
                            className="p-1.5 rounded-lg hover:bg-background-hover text-foreground-secondary"
                            onClick={() => {
                                // setCurItem?.('history');
                                chatService.globalState.setCurNavItem(NavItemEnum.History);
                                navigate(RouterNames.History);
                            }}
                        >
                            <div className="text-small">
                                <IconClock />
                            </div>
                        </button>
                    </Tooltip> */}
				</div>
			</div>
			<div className={historyStyles.list}>
				{conversationsPageInfo.items.map((item) => (
					<HistoryItem
						key={item.conversationId}
						onClick={() => {
							chatService.globalState.setCurNavItem(NavItemEnum.Conversation);
							chatService.globalState.setCurConversation({
								...item,
								loaded: false,
							});
							console.log('ite1232132m', item.conversationId);
							onHistoryItemClick(item.conversationId, {
								navigate,
							});
						}}
						onMenuClick={(chatId, op) => {
							if (op === HistoryItemOp.DELETE) {
								Modal.confirm({
									title: '确定删除该对话吗？',
									onOk: () => {
										chatService.deleteConversation(chatId);
									},
									onCancel: () => {
										console.log('取消');
									},
								});
							}
						}}
						item={item}
					/>
				))}
				<div ref={loadingRef} className={historyStyles.loading}>
					{loading
						? '加载中...'
						: conversationsPageInfo.hasMore
						? ''
						: '没有更多了'}
				</div>
			</div>
		</div>
	);
};
