import { ClientMessageFrom } from '../../../constants/message';

export type BaseChatMessage = {
	id?: string;
	msg_from: ClientMessageFrom;
	conversation_id: string;
	csrf_token?: string;
	business_info?: Record<string, any>;
	venue_id: number;
};
