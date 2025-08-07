import { ChatService } from '@/services/chatGlobalState';
import { RenderElementProps } from 'slate-react';

export interface CustomRenderElementProps extends RenderElementProps {
	chatService: ChatService;
}
