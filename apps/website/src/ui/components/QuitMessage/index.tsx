import { QuitClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface QuitMessageProps {
	message: QuitClientMessage;
}

export const QuitMessage: React.FC<QuitMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-red-900/50 border border-red-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-red-200">
					<span>🚪</span>
					<span>会话结束</span>
					{message.duration && (
						<span className="text-xs text-red-300">
							时长: {message.duration}
						</span>
					)}
				</div>
				<div className="mt-1 text-xs text-red-100">{message.content}</div>
			</div>
		</div>
	);
};
