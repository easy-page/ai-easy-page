import React from 'react';

import {
	ChatMessageContext,
	ChatMessageContextType,
} from '@/common/interfaces/messages/chatMessages/context';
import { FileContext } from './components/FileContext';
import { ImageContext } from './components/ImageContext';

export interface ContextCardProps {
	card: ChatMessageContext;
	onDelete?: (id: string) => void;
	showDelete?: boolean;
}

export const ContextCard: React.FC<ContextCardProps> = ({
	card: context,
	onDelete,
	showDelete = true,
}) => {
	switch (context.type) {
		case ChatMessageContextType.FILE:
			return (
				<FileContext key={context.id} context={context} onDelete={onDelete} />
			);
		case ChatMessageContextType.IMAGE:
			return (
				<ImageContext key={context.id} context={context} onDelete={onDelete} />
			);
		default:
			return null;
	}
};
