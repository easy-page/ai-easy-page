import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { Icons } from '@/views/aiChat/baseUi/components/icons';

const { Text } = Typography;

interface ToolDetailsProps {
	toolInfo?: {
		args?: Record<string, unknown>;
		isClientInitiated?: boolean;
	};
	status: string;
	hasOutput: any;
	hasUpdate: boolean;
	detail: {
		response?: {
			resultDisplay?: any;
		};
		startTime?: number;
	};
}

export const ToolDetails: React.FC<ToolDetailsProps> = ({
	toolInfo,
	status,
	hasOutput,
	hasUpdate,
	detail,
}) => {
	const formatArgs = (args: Record<string, unknown>) => {
		// 简化参数显示，只显示关键信息
		const simplified: Record<string, unknown> = {};
		Object.entries(args).forEach(([key, value]) => {
			if (typeof value === 'string' && value.length > 50) {
				simplified[key] = value.substring(0, 50) + '...';
			} else {
				simplified[key] = value;
			}
		});
		return simplified;
	};

	return (
		<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
			{/* 工具参数 */}
			{toolInfo?.args && Object.keys(toolInfo.args).length > 0 && (
				<div className="w-full overflow-hidden">
					<Text className="text-foreground-secondary text-xs mb-1 block font-medium">
						参数:
					</Text>
					<pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto w-full break-words whitespace-pre-wrap">
						{JSON.stringify(formatArgs(toolInfo.args), null, 2)}
					</pre>
				</div>
			)}

			{/* 错误信息 */}
			{status === 'error' && (
				<div className="w-full overflow-hidden">
					<Text className="text-red-600 text-xs font-medium mb-1 block">
						错误信息:
					</Text>
					<div className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800 w-full break-words">
						执行出错
					</div>
				</div>
			)}

			{/* 输出内容 */}
			{hasOutput && (
				<div className="w-full overflow-hidden">
					<Text className="text-foreground-secondary text-xs mb-1 block font-medium">
						{status === 'executing' ? '实时输出:' : '结果:'}
					</Text>
					<div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-32 overflow-y-auto w-full break-words whitespace-pre-wrap">
						{typeof hasOutput === 'string'
							? hasOutput
							: JSON.stringify(hasOutput, null, 2)}
					</div>
				</div>
			)}

			{/* 执行结果 - 只在没有update时显示response的结果 */}
			{!hasUpdate && detail.response?.resultDisplay && status !== 'error' && (
				<div className="w-full overflow-hidden">
					<Text className="text-foreground-secondary text-xs mb-1 block font-medium">
						结果:
					</Text>
					<div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-32 overflow-y-auto w-full break-words whitespace-pre-wrap">
						{typeof detail.response.resultDisplay === 'string'
							? detail.response.resultDisplay
							: JSON.stringify(detail.response.resultDisplay, null, 2)}
					</div>
				</div>
			)}

			{/* 额外信息 */}
			<div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-4">
					{detail.startTime && (
						<div className="flex items-center gap-1">
							<Icons.ClockIcon className="text-foreground-secondary w-3 h-3" />
							<Text className="text-foreground-secondary text-xs">
								{new Date(detail.startTime).toLocaleTimeString()}
							</Text>
						</div>
					)}
					{toolInfo?.isClientInitiated && (
						<div className="flex items-center gap-1">
							<Icons.Person className="text-foreground-secondary w-3 h-3" />
							<Text className="text-foreground-secondary text-xs">
								用户发起
							</Text>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
