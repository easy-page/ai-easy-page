import { InfoClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface InfoMessageProps {
	message: InfoClientMessage;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ message }) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-blue-900/50 border border-blue-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-blue-200">
					<span>💡</span>
					<span>信息</span>
				</div>
				<div className="mt-1 text-xs text-blue-100">{message.content}</div>
			</div>
		</div>
	);
};
