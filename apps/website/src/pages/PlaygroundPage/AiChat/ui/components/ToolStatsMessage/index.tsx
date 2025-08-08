import { ToolStatsClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface ToolStatsMessageProps {
	message: ToolStatsClientMessage;
}

// 假设工具统计可能包含的详细信息
interface ToolStatsData {
	totalTools?: number;
	successfulTools?: number;
	failedTools?: number;
	tools?: Array<{
		name: string;
		usageCount: number;
		successRate: number;
		avgResponseTime: number;
		lastUsed?: string;
	}>;
	performance?: {
		avgResponseTime?: number;
		totalExecutionTime?: number;
		successRate?: number;
	};
	categories?: {
		[category: string]: number;
	};
}

export const ToolStatsMessage: React.FC<ToolStatsMessageProps> = ({
	message,
}) => {
	// 尝试解析content中的JSON数据，如果失败则显示原始内容
	let statsData: ToolStatsData | null = null;
	try {
		if (message.content && message.content.startsWith('{')) {
			statsData = JSON.parse(message.content);
		}
	} catch (e) {
		// 如果解析失败，保持为null，显示原始内容
	}

	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-green-900/50 border border-green-500/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 text-sm text-green-200 mb-3">
					<span>🔧</span>
					<span>工具统计</span>
				</div>

				{statsData ? (
					<div className="space-y-3">
						{/* 总体统计 */}
						{(statsData.totalTools !== undefined ||
							statsData.successfulTools !== undefined ||
							statsData.failedTools !== undefined) && (
							<div className="bg-green-100 rounded p-2">
								<div className="text-xs font-medium text-green-700 mb-2">
									总体统计
								</div>
								<div className="grid grid-cols-3 gap-2 text-xs">
									{statsData.totalTools !== undefined && (
										<div>
											<span className="text-green-600">总调用:</span>
											<span className="ml-1 font-medium">
												{statsData.totalTools}
											</span>
										</div>
									)}
									{statsData.successfulTools !== undefined && (
										<div>
											<span className="text-green-600">成功:</span>
											<span className="ml-1 font-medium text-green-800">
												{statsData.successfulTools}
											</span>
										</div>
									)}
									{statsData.failedTools !== undefined && (
										<div>
											<span className="text-green-600">失败:</span>
											<span className="ml-1 font-medium text-red-600">
												{statsData.failedTools}
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* 性能指标 */}
						{statsData.performance && (
							<div className="bg-green-100 rounded p-2">
								<div className="text-xs font-medium text-green-700 mb-2">
									性能指标
								</div>
								<div className="space-y-1 text-xs">
									{statsData.performance.avgResponseTime && (
										<div className="flex justify-between">
											<span className="text-green-600">平均响应时间:</span>
											<span className="font-medium">
												{statsData.performance.avgResponseTime}ms
											</span>
										</div>
									)}
									{statsData.performance.totalExecutionTime && (
										<div className="flex justify-between">
											<span className="text-green-600">总执行时间:</span>
											<span className="font-medium">
												{statsData.performance.totalExecutionTime}ms
											</span>
										</div>
									)}
									{statsData.performance.successRate && (
										<div className="flex justify-between">
											<span className="text-green-600">成功率:</span>
											<span className="font-medium">
												{(statsData.performance.successRate * 100).toFixed(1)}%
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* 工具分类统计 */}
						{statsData.categories &&
							Object.keys(statsData.categories).length > 0 && (
								<div className="bg-green-100 rounded p-2">
									<div className="text-xs font-medium text-green-700 mb-2">
										工具分类
									</div>
									<div className="space-y-1 text-xs">
										{Object.entries(statsData.categories).map(
											([category, count]) => (
												<div key={category} className="flex justify-between">
													<span className="text-green-600">{category}:</span>
													<span className="font-medium">{count}</span>
												</div>
											)
										)}
									</div>
								</div>
							)}

						{/* 具体工具统计 */}
						{statsData.tools && statsData.tools.length > 0 && (
							<div className="bg-green-100 rounded p-2">
								<div className="text-xs font-medium text-green-700 mb-2">
									工具详情
								</div>
								<div className="space-y-2">
									{statsData.tools.slice(0, 3).map((tool, index) => (
										<div
											key={index}
											className="border border-green-200 rounded p-2 bg-white"
										>
											<div className="flex justify-between items-center mb-1">
												<span className="text-xs font-medium text-green-800">
													{tool.name}
												</span>
												<span className="text-xs text-green-600">
													使用 {tool.usageCount} 次
												</span>
											</div>
											<div className="flex justify-between text-xs">
												<span className="text-green-600">
													成功率: {(tool.successRate * 100).toFixed(1)}%
												</span>
												<span className="text-green-600">
													平均响应: {tool.avgResponseTime}ms
												</span>
											</div>
										</div>
									))}
									{statsData.tools.length > 3 && (
										<div className="text-xs text-green-600 text-center">
											还有 {statsData.tools.length - 3} 个工具...
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="text-xs text-green-600">{message.content}</div>
				)}
			</div>
		</div>
	);
};
