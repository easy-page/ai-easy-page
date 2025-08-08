import { StatsClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface StatsMessageProps {
	message: StatsClientMessage;
}

// 假设会话统计可能包含的详细信息
interface SessionStatsData {
	totalMessages?: number;
	userMessages?: number;
	assistantMessages?: number;
	totalTokens?: number;
	modelUsage?: {
		[modelName: string]: {
			tokens: number;
			cost: number;
			usageCount: number;
		};
	};
	toolUsage?: {
		totalCalls: number;
		successfulCalls: number;
		failedCalls: number;
		tools: Array<{
			name: string;
			calls: number;
			successRate: number;
		}>;
	};
	performance?: {
		avgResponseTime?: number;
		totalSessionTime?: number;
		peakConcurrency?: number;
	};
	engagement?: {
		messageFrequency?: number;
		avgMessageLength?: number;
		interactionDepth?: number;
	};
}

export const StatsMessage: React.FC<StatsMessageProps> = ({ message }) => {
	// 尝试解析content中的JSON数据，如果失败则显示原始内容
	let statsData: SessionStatsData | null = null;
	try {
		if (message.content && message.content.startsWith('{')) {
			statsData = JSON.parse(message.content);
		}
	} catch (e) {
		// 如果解析失败，保持为null，显示原始内容
	}

	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-gray-200 mb-3">
					<span>📊</span>
					<span>会话统计</span>
					{message.duration && (
						<span className="text-xs text-gray-400">
							时长: {message.duration}
						</span>
					)}
				</div>

				{statsData ? (
					<div className="space-y-3">
						{/* 基础统计 */}
						{(statsData.totalMessages !== undefined ||
							statsData.userMessages !== undefined ||
							statsData.assistantMessages !== undefined) && (
							<div className="bg-gray-700/50 rounded p-2">
								<div className="text-xs font-medium text-gray-200 mb-2">
									消息统计
								</div>
								<div className="grid grid-cols-3 gap-2 text-xs">
									{statsData.totalMessages !== undefined && (
										<div>
											<span className="text-gray-400">总消息:</span>
											<span className="ml-1 font-medium text-gray-200">
												{statsData.totalMessages}
											</span>
										</div>
									)}
									{statsData.userMessages !== undefined && (
										<div>
											<span className="text-gray-400">用户消息:</span>
											<span className="ml-1 font-medium text-gray-200">
												{statsData.userMessages}
											</span>
										</div>
									)}
									{statsData.assistantMessages !== undefined && (
										<div>
											<span className="text-gray-400">助手消息:</span>
											<span className="ml-1 font-medium text-gray-200">
												{statsData.assistantMessages}
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Token 统计 */}
						{statsData.totalTokens && (
							<div className="bg-gray-700/50 rounded p-2">
								<div className="text-xs font-medium text-gray-200 mb-2">
									Token 统计
								</div>
								<div className="text-xs">
									<span className="text-gray-400">总 Token 数:</span>
									<span className="ml-1 font-medium text-gray-200">
										{statsData.totalTokens.toLocaleString()}
									</span>
								</div>
							</div>
						)}

						{/* 模型使用统计 */}
						{statsData.modelUsage &&
							Object.keys(statsData.modelUsage).length > 0 && (
								<div className="bg-gray-700/50 rounded p-2">
									<div className="text-xs font-medium text-gray-200 mb-2">
										模型使用情况
									</div>
									<div className="space-y-1 text-xs">
										{Object.entries(statsData.modelUsage).map(
											([modelName, usage]) => (
												<div
													key={modelName}
													className="flex justify-between items-center"
												>
													<span className="text-gray-400">{modelName}:</span>
													<div className="text-right">
														<div className="font-medium text-gray-200">
															{usage.tokens.toLocaleString()} tokens
														</div>
														<div className="text-gray-400">
															${usage.cost.toFixed(4)} | {usage.usageCount} 次
														</div>
													</div>
												</div>
											)
										)}
									</div>
								</div>
							)}

						{/* 工具使用统计 */}
						{statsData.toolUsage && (
							<div className="bg-gray-700/50 rounded p-2">
								<div className="text-xs font-medium text-gray-200 mb-2">
									工具使用情况
								</div>
								<div className="grid grid-cols-3 gap-2 text-xs mb-2">
									<div>
										<span className="text-gray-400">总调用:</span>
										<span className="ml-1 font-medium text-gray-200">
											{statsData.toolUsage.totalCalls}
										</span>
									</div>
									<div>
										<span className="text-gray-400">成功:</span>
										<span className="ml-1 font-medium text-green-400">
											{statsData.toolUsage.successfulCalls}
										</span>
									</div>
									<div>
										<span className="text-gray-400">失败:</span>
										<span className="ml-1 font-medium text-red-400">
											{statsData.toolUsage.failedCalls}
										</span>
									</div>
								</div>
								{statsData.toolUsage.tools &&
									statsData.toolUsage.tools.length > 0 && (
										<div className="space-y-1">
											{statsData.toolUsage.tools
												.slice(0, 3)
												.map((tool, index) => (
													<div
														key={index}
														className="flex justify-between text-xs"
													>
														<span className="text-gray-400">{tool.name}:</span>
														<span className="font-medium text-gray-200">
															{tool.calls} 次 (
															{(tool.successRate * 100).toFixed(0)}%)
														</span>
													</div>
												))}
											{statsData.toolUsage.tools.length > 3 && (
												<div className="text-xs text-gray-400 text-center">
													还有 {statsData.toolUsage.tools.length - 3} 个工具...
												</div>
											)}
										</div>
									)}
							</div>
						)}

						{/* 性能统计 */}
						{statsData.performance && (
							<div className="bg-gray-700/50 rounded p-2">
								<div className="text-xs font-medium text-gray-200 mb-2">
									性能统计
								</div>
								<div className="space-y-1 text-xs">
									{statsData.performance.avgResponseTime && (
										<div className="flex justify-between">
											<span className="text-gray-400">平均响应时间:</span>
											<span className="font-medium text-gray-200">
												{statsData.performance.avgResponseTime}ms
											</span>
										</div>
									)}
									{statsData.performance.totalSessionTime && (
										<div className="flex justify-between">
											<span className="text-gray-400">总会话时间:</span>
											<span className="font-medium text-gray-200">
												{statsData.performance.totalSessionTime}ms
											</span>
										</div>
									)}
									{statsData.performance.peakConcurrency && (
										<div className="flex justify-between">
											<span className="text-gray-400">峰值并发:</span>
											<span className="font-medium text-gray-200">
												{statsData.performance.peakConcurrency}
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* 参与度统计 */}
						{statsData.engagement && (
							<div className="bg-gray-700/50 rounded p-2">
								<div className="text-xs font-medium text-gray-200 mb-2">
									参与度统计
								</div>
								<div className="space-y-1 text-xs">
									{statsData.engagement.messageFrequency && (
										<div className="flex justify-between">
											<span className="text-gray-400">消息频率:</span>
											<span className="font-medium text-gray-200">
												{statsData.engagement.messageFrequency} 条/分钟
											</span>
										</div>
									)}
									{statsData.engagement.avgMessageLength && (
										<div className="flex justify-between">
											<span className="text-gray-400">平均消息长度:</span>
											<span className="font-medium text-gray-200">
												{statsData.engagement.avgMessageLength} 字符
											</span>
										</div>
									)}
									{statsData.engagement.interactionDepth && (
										<div className="flex justify-between">
											<span className="text-gray-400">交互深度:</span>
											<span className="font-medium text-gray-200">
												{statsData.engagement.interactionDepth}
											</span>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-2">
						{message.content && (
							<div className="text-xs text-gray-200">{message.content}</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
