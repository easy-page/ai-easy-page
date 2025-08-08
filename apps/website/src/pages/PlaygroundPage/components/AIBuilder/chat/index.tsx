import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { NavItemEnum } from '@/services/chatGlobalState/constant';
import { useEffect, useMemo, useState } from 'react';
import { ChatMode } from '@/common/constants/scence';
import { getQueryString } from '@/common/utils/url';
import { NewChatPanel } from '@/ui/panels/NewChatPanel';
import { ConversationPanel } from '@/ui/panels/ConversationPanel';
import { getChatUrl } from '@/routers/toChat';
import { useNavigate } from 'react-router-dom';
import { RouterNames } from '@/routers/constant';
import { TopNav } from '@/ui/components/TopNav';

export type VenueChatPanelProps = {
	venueId: number;
};

/**
 * 就是没有消息的页面，没有会话 ID, 发送消息之后会进入会话 ID
 * @returns
 */
export const VenueChatPanel = (props: VenueChatPanelProps) => {
	const chatService = useService(ChatService);
	const curNavItem = useObservable(
		chatService.globalState.curNavItem$,
		NavItemEnum.NewChat
	);

	// const navigate = useNavigate();

	const chatMode = useMemo(() => {
		return curNavItem === NavItemEnum.Conversation
			? ChatMode.Conversation
			: ChatMode.NewChat;
	}, [curNavItem]);

	useEffect(() => {
		const chatId = getQueryString('chatId');
		if (chatId && curNavItem === NavItemEnum.NewChat) {
			chatService.globalState.setCurNavItem(NavItemEnum.Conversation);
		}

		// if (!chatId) {
		// 	const toConversation = (cvId: string) => {
		// 		const url = getChatUrl({ chatId: cvId });
		// 		if (url.startsWith('/')) {
		// 			navigate(url.replace(RouterNames.Chat, ''));
		// 		} else {
		// 			navigate(`${url}`);
		// 		}
		// 	};
		// 	toConversation(chatId);
		// }
	}, []);
	return (
		<div className="flex flex-col overflow-hidden">
			<TopNav
				onHistoryItemClick={(chatId, { navigate }) => {
					const url = getChatUrl({ chatId: chatId });
					if (url.startsWith('/')) {
						navigate(url.replace(RouterNames.Chat, ''));
						chatService.globalState.setCurNavItem(NavItemEnum.Conversation);
					} else {
						navigate(`${url}`);
					}
				}}
				onNavItemChange={(item, { navigate }) => {
					if (item === NavItemEnum.NewChat) {
						chatService.globalState.setCurNavItem(NavItemEnum.NewChat);
					}
				}}
			/>
			{chatMode === ChatMode.NewChat ? <NewChatPanel /> : <ConversationPanel />}
		</div>
	);
};
