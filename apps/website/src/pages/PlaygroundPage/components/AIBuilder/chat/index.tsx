import { useObservable } from '../../../AiChat/hooks/useObservable';
import { useService } from '../../../AiChat/infra';
import { ChatService } from '../../../AiChat/services/chatGlobalState';
import { NavItemEnum } from '../../../AiChat/services/chatGlobalState/constant';
import { useEffect, useMemo, useState } from 'react';
import { ChatMode } from '../../../AiChat/common/constants/scence';
import { getQueryString } from '../../../AiChat/common/utils/url';
import { NewChatPanel } from '../../../AiChat/ui/panels/NewChatPanel';
import { ConversationPanel } from '../../../AiChat/ui/panels/ConversationPanel';
import { getChatUrl } from '../../../AiChat/routers/toChat';
import { useNavigate } from 'react-router-dom';
import { RouterNames } from '../../../AiChat/routers/constant';
import { TopNav } from '../../../AiChat/ui/components/TopNav';

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
