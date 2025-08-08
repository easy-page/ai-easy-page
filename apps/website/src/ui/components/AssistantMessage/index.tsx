import {
	ServerMessage,
	ServerMsgCard,
} from '../../../common/interfaces/messages/chatMessages/server';
import { useState, useMemo, useEffect } from 'react';
import { ChatMarkdownRender } from '../ChatMarkdownRender';
import { AssistantMessageToolbar } from './toolbar';
import { useService } from '@/infra';
import { ChatService } from '../../../services/chatGlobalState';

export type AssistantMessageProps = {
	message: ServerMessage;
	isLastMsg?: boolean;
};

export const AssistantMessage = ({
	message,
	isLastMsg,
}: AssistantMessageProps) => {
	const chatService = useService(ChatService);
	const [currentVersion, setCurrentVersion] = useState(0);
	const curMessages = useMemo(() => {
		// TODO 版本管理的能力有问题，暂时屏蔽
		const versions = (message.versions || []).map((item) => item.content);
		return [...versions, message.content];
	}, [message]);

	useEffect(() => {
		setCurrentVersion(curMessages.length - 1);
	}, [curMessages.length]);

	const currentContent = curMessages[currentVersion];

	return (
		<div className="py-4 text-small content-start group">
			<div
				className="flex flex-col text-wrap gap-2 bg-gray-900/90 border border-cyan-500/20 rounded-lg p-3 overflow-hidden backdrop-blur-sm shadow-lg"
				style={{
					width: 'fit-content',
					maxWidth: '85%',
					wordBreak: 'break-all',
				}}
			>
				<ChatMarkdownRender
					content={currentContent}
					cards={message.cards || {}}
					isStreaming={message.isStreaming}
				/>
			</div>
			<AssistantMessageToolbar
				chatService={chatService}
				message={message}
				isLastMsg={isLastMsg}
				currentVersion={currentVersion}
				setCurrentVersion={setCurrentVersion}
			/>
		</div>
	);
};
