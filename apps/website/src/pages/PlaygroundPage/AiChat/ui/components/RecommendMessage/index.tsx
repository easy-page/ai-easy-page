import { ServerRecommandMessage } from '../../../common/interfaces/messages/chatMessages/server';

interface RecommendMessageProps {
	message: ServerRecommandMessage;
}

export const RecommendMessage: React.FC<RecommendMessageProps> = ({
	message,
}) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-yellow-900/50 border border-yellow-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-yellow-200 mb-3">
					<span>💡</span>
					<span>推荐问题</span>
				</div>
				<div className="space-y-2">
					{Array.isArray(message.content) ? (
						message.content.map((item, index) => (
							<div
								key={index}
								className="bg-gray-800/50 border border-yellow-500/20 rounded px-3 py-2 text-sm text-gray-200 hover:bg-yellow-500/10 cursor-pointer transition-colors"
							>
								{item}
							</div>
						))
					) : (
						<div className="text-sm text-gray-200">{message.content}</div>
					)}
				</div>
			</div>
		</div>
	);
};
