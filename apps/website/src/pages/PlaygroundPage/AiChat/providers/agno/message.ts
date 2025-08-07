import { UserClientMessage } from '../../common/interfaces/messages/chatMessages/client';

export type AgnoClientMessage = Omit<UserClientMessage, 'id'> & {
	business_info: {
		bizLine?: number;
		env?: string;
	};
	csrf_token: string;
};
