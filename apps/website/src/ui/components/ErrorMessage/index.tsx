import { ErrorClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface ErrorMessageProps {
	message: ErrorClientMessage;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-red-900/50 border border-red-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-red-200">
					<span>❌</span>
					<span>错误</span>
				</div>
				<div className="mt-1 text-xs text-red-100">{message.content}</div>
			</div>
		</div>
	);
};
