import { UserShellClientMessage } from '../../../common/interfaces/messages/chatMessages/client';
import { ChatMarkdownRender } from '../ChatMarkdownRender';

interface UserShellMessageProps {
	message: UserShellClientMessage;
}

export const UserShellMessage: React.FC<UserShellMessageProps> = ({
	message,
}) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-xs text-gray-500">Shell</span>
					<span className="text-xs text-gray-400">$</span>
				</div>
				<div className="font-mono text-sm text-gray-800">{message.content}</div>
			</div>
		</div>
	);
};
