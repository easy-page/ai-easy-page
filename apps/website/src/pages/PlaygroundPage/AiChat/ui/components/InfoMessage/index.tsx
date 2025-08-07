import { InfoClientMessage } from '@/common/interfaces/messages/chatMessages/client';

interface InfoMessageProps {
	message: InfoClientMessage;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-blue-700">
					<span>💡</span>
					<span>信息</span>
				</div>
				<div className="mt-1 text-xs text-blue-600">{message.content}</div>
			</div>
		</div>
	);
};
