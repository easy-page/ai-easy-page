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
			<div className="max-w-[80%] bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-xs text-gray-300">Shell</span>
					<span className="text-xs text-gray-400">$</span>
				</div>
				<div className="font-mono text-sm text-gray-200">{message.content}</div>
			</div>
		</div>
	);
};
