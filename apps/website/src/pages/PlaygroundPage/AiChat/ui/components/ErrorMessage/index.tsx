import { ErrorClientMessage } from '@/common/interfaces/messages/chatMessages/client';

interface ErrorMessageProps {
	message: ErrorClientMessage;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-red-700">
					<span>❌</span>
					<span>错误</span>
				</div>
				<div className="mt-1 text-xs text-red-600">{message.content}</div>
			</div>
		</div>
	);
};
