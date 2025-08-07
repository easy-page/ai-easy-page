import { ServerRecommandMessage } from '@/common/interfaces/messages/chatMessages/server';

interface RecommendMessageProps {
	message: ServerRecommandMessage;
}

export const RecommendMessage: React.FC<RecommendMessageProps> = ({
	message,
}) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-yellow-700 mb-3">
					<span>💡</span>
					<span>推荐问题</span>
				</div>
				<div className="space-y-2">
					{Array.isArray(message.content) ? (
						message.content.map((item, index) => (
							<div
								key={index}
								className="bg-white border border-yellow-200 rounded px-3 py-2 text-sm text-gray-700 hover:bg-yellow-100 cursor-pointer transition-colors"
							>
								{item}
							</div>
						))
					) : (
						<div className="text-sm text-gray-700">{message.content}</div>
					)}
				</div>
			</div>
		</div>
	);
};
