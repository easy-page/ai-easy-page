import {
	ToolGroupClientMessage,
	ToolCallStatus,
} from '../../../common/interfaces/messages/chatMessages/client';
import { ChatMarkdownRender } from '../ChatMarkdownRender';

interface ToolGroupMessageProps {
	message: ToolGroupClientMessage;
}

const getStatusColor = (status: ToolCallStatus) => {
	switch (status) {
		case ToolCallStatus.Success:
			return 'text-green-600';
		case ToolCallStatus.Error:
			return 'text-red-600';
		case ToolCallStatus.Executing:
			return 'text-blue-600';
		case ToolCallStatus.Pending:
			return 'text-yellow-600';
		case ToolCallStatus.Confirming:
			return 'text-orange-600';
		case ToolCallStatus.Canceled:
			return 'text-gray-600';
		default:
			return 'text-gray-600';
	}
};

const getStatusText = (status: ToolCallStatus) => {
	switch (status) {
		case ToolCallStatus.Success:
			return '成功';
		case ToolCallStatus.Error:
			return '错误';
		case ToolCallStatus.Executing:
			return '执行中';
		case ToolCallStatus.Pending:
			return '等待中';
		case ToolCallStatus.Confirming:
			return '确认中';
		case ToolCallStatus.Canceled:
			return '已取消';
		default:
			return '未知';
	}
};

export const ToolGroupMessage: React.FC<ToolGroupMessageProps> = ({
	message,
}) => {
	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2 mb-3">
					<span className="text-sm font-medium text-gray-200">工具调用</span>
					<span className="text-xs text-gray-400">
						({message.tools.length} 个工具)
					</span>
				</div>

				<div className="space-y-3">
					{message.tools.map((tool) => (
						<div
							key={tool.callId}
							className="border border-gray-600/30 rounded p-3 bg-gray-700/30"
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-200">
									{tool.name}
								</span>
								<span className={`text-xs ${getStatusColor(tool.status)}`}>
									{getStatusText(tool.status)}
								</span>
							</div>

							<div className="text-xs text-gray-300 mb-2">
								{tool.description}
							</div>

							{tool.resultDisplay && (
								<div className="bg-gray-700/50 rounded p-2 text-xs text-gray-200">
									{tool.renderOutputAsMarkdown ? (
										<ChatMarkdownRender
											content={
												typeof tool.resultDisplay === 'string'
													? tool.resultDisplay
													: JSON.stringify(tool.resultDisplay)
											}
											cards={{}}
										/>
									) : (
										<pre className="whitespace-pre-wrap">
											{typeof tool.resultDisplay === 'string'
												? tool.resultDisplay
												: JSON.stringify(tool.resultDisplay, null, 2)}
										</pre>
									)}
								</div>
							)}

							{tool.confirmationDetails && (
								<div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-500/30 rounded text-xs">
									<div className="font-medium text-yellow-200 mb-1">
										{tool.confirmationDetails.title}
									</div>
									{tool.confirmationDetails.type === 'exec' &&
										'command' in tool.confirmationDetails && (
											<div className="font-mono text-yellow-100">
												{tool.confirmationDetails.command}
											</div>
										)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
