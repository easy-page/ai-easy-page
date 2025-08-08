import { ModelStatsClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface ModelStatsMessageProps {
	message: ModelStatsClientMessage;
}

// 假设模型统计可能包含的详细信息
interface ModelStatsData {
	modelName?: string;
	tokenCount?: number;
	responseTime?: number;
	cost?: number;
	usage?: {
		promptTokens?: number;
		completionTokens?: number;
		totalTokens?: number;
	};
	performance?: {
		latency?: number;
		throughput?: number;
	};
}

export const ModelStatsMessage: React.FC<ModelStatsMessageProps> = ({
	message,
}) => {
	// 尝试解析content中的JSON数据，如果失败则显示原始内容
	let statsData: ModelStatsData | null = null;
	try {
		if (message.content && message.content.startsWith('{')) {
			statsData = JSON.parse(message.content);
		}
	} catch (e) {
		// 如果解析失败，保持为null，显示原始内容
	}

	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-blue-900/50 border border-blue-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-blue-200 mb-3">
					<span>🤖</span>
					<span>模型统计</span>
				</div>

				{statsData ? (
					<div className="space-y-3">
						{statsData.modelName && (
							<div className="flex items-center justify-between">
								<span className="text-xs text-blue-300">模型名称:</span>
								<span className="text-xs font-medium text-blue-100">
									{statsData.modelName}
								</span>
							</div>
						)}

						{statsData.usage && (
							<div className="bg-blue-800/50 rounded p-2">
								<div className="text-xs font-medium text-blue-200 mb-2">
									Token 使用情况
								</div>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div>
										<span className="text-blue-300">Prompt:</span>
										<span className="ml-1 font-medium text-blue-100">
											{statsData.usage.promptTokens || 0}
										</span>
									</div>
									<div>
										<span className="text-blue-300">Completion:</span>
										<span className="ml-1 font-medium text-blue-100">
											{statsData.usage.completionTokens || 0}
										</span>
									</div>
									<div>
										<span className="text-blue-300">Total:</span>
										<span className="ml-1 font-medium text-blue-100">
											{statsData.usage.totalTokens || 0}
										</span>
									</div>
								</div>
							</div>
						)}

						{statsData.performance && (
							<div className="bg-blue-800/50 rounded p-2">
								<div className="text-xs font-medium text-blue-200 mb-2">
									性能指标
								</div>
								<div className="grid grid-cols-2 gap-2 text-xs">
									{statsData.performance.latency && (
										<div>
											<span className="text-blue-300">延迟:</span>
											<span className="ml-1 font-medium text-blue-100">
												{statsData.performance.latency}ms
											</span>
										</div>
									)}
									{statsData.performance.throughput && (
										<div>
											<span className="text-blue-300">吞吐量:</span>
											<span className="ml-1 font-medium text-blue-100">
												{statsData.performance.throughput} tokens/s
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{statsData.cost && (
							<div className="flex items-center justify-between">
								<span className="text-xs text-blue-300">预估成本:</span>
								<span className="text-xs font-medium text-blue-100">
									${statsData.cost.toFixed(4)}
								</span>
							</div>
						)}

						{statsData.responseTime && (
							<div className="flex items-center justify-between">
								<span className="text-xs text-blue-300">响应时间:</span>
								<span className="text-xs font-medium text-blue-100">
									{statsData.responseTime}ms
								</span>
							</div>
						)}
					</div>
				) : (
					<div className="text-xs text-blue-200">{message.content}</div>
				)}
			</div>
		</div>
	);
};
