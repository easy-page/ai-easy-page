import { QuitClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface QuitMessageProps {
	message: QuitClientMessage;
}

export const QuitMessage: React.FC<QuitMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-red-700">
					<span>🚪</span>
					<span>会话结束</span>
					{message.duration && (
						<span className="text-xs text-red-500">
							时长: {message.duration}
						</span>
					)}
				</div>
				<div className="mt-1 text-xs text-red-600">{message.content}</div>
			</div>
		</div>
	);
};
