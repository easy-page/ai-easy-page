import { MarkdownRenderer } from '../MarkdownRender';
import * as react from 'react';
import React from 'react';

import {
	ServerMessage,
	ServerMsgCard,
} from '../../../common/interfaces/messages/chatMessages/server';
import { ServerMessageCardType } from '../../../common/constants/message';

import { ToolsExecInfo } from '../AssistantMessage/ToolsExecInfo';
import { ThoughtCard } from '../ThoughtCard';
import { ToolCard } from '../ToolCard';
import { ConfirmCard } from '../ConfirmCard';
import { ErrorCard } from '../ErrorCard';
import { toNumber } from '../../../common/utils/number';

export interface ChatUIHocChildrenProps {
	react: typeof react;
	toNumber: (val: string) => number | undefined;
}

type ChatMarkdownRenderProps = {
	content: string;
	isStreaming?: boolean;
	cards: Record<string, ServerMsgCard<any>>;
};

const ChatUIHoc = React.memo(
	({
		children,
	}: {
		children: (props: ChatUIHocChildrenProps) => React.ReactNode; // 内部组件的属性
	}) => {
		return children({
			toNumber: toNumber,
			react,
		});
	}
);

const CustomCard = React.memo(
	({
		id,
		messageId,
		conversationId,
		cards,
	}: {
		id: string;
		messageId: string;
		conversationId: string;
		cards: Record<string, ServerMsgCard<any>>;
	}) => {
		const card = cards[id];
		if (!card) {
			return <div>卡片未找到: {id}</div>;
		}

		console.log('card:', card);
		const commonProps = {
			id: card.id,
			messageId,
			conversationId,
			detail: card.detail,
		};

		switch (card.type) {
			case ServerMessageCardType.ThoughtCard:
				return <ThoughtCard {...commonProps} />;
			case ServerMessageCardType.ToolCard:
				return <ToolCard {...commonProps} />;
			case ServerMessageCardType.ConfirmCard:
				return <ConfirmCard {...commonProps} />;
			case ServerMessageCardType.ErrorCard:
				return <ErrorCard {...commonProps} />;
			default:
				return <div>未知卡片类型: {card.type}</div>;
		}
	}
);

export const ChatMarkdownRender = ({
	content,
	isStreaming = false,
	cards,
}: ChatMarkdownRenderProps) => {
	const cardsRef = react.useRef<Record<string, ServerMsgCard<any>>>(cards);
	// react.useEffect(() => {
	// 	cardsRef.current = cards;
	// }, [cards]);
	cardsRef.current = cards;
	return (
		<MarkdownRenderer
			content={content}
			presetComponents={{
				UIHoc: ChatUIHoc,
				CustomCard: (props: {
					id: string;
					messageId: string;
					conversationId: string;
				}) => <CustomCard {...props} cards={cardsRef.current} />,
			}}
			isStreaming={isStreaming}
		/>
	);
};
