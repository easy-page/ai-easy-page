import { ModelContentClientMessage } from '@/common/interfaces/messages/chatMessages/client';
import { ChatMarkdownRender } from '../ChatMarkdownRender';

interface ModelContentMessageProps {
	message: ModelContentClientMessage;
}

export const ModelContentMessage: React.FC<ModelContentMessageProps> = ({
	message,
}) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
					<span>📝</span>
					<span>模型内容</span>
				</div>
				<div className="text-sm text-gray-800">
					<ChatMarkdownRender content={message.content} cards={{}} />
				</div>
			</div>
		</div>
	);
};
