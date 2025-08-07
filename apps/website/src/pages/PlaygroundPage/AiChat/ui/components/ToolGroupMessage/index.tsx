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
			<div className="max-w-[80%] bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
				<div className="flex items-center gap-2 mb-3">
					<span className="text-sm font-medium text-gray-700">工具调用</span>
					<span className="text-xs text-gray-500">
						({message.tools.length} 个工具)
					</span>
				</div>

				<div className="space-y-3">
					{message.tools.map((tool) => (
						<div
							key={tool.callId}
							className="border border-gray-200 rounded p-3"
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-800">
									{tool.name}
								</span>
								<span className={`text-xs ${getStatusColor(tool.status)}`}>
									{getStatusText(tool.status)}
								</span>
							</div>

							<div className="text-xs text-gray-600 mb-2">
								{tool.description}
							</div>

							{tool.resultDisplay && (
								<div className="bg-gray-50 rounded p-2 text-xs text-gray-700">
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
								<div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
									<div className="font-medium text-yellow-800 mb-1">
										{tool.confirmationDetails.title}
									</div>
									{tool.confirmationDetails.type === 'exec' &&
										'command' in tool.confirmationDetails && (
											<div className="font-mono text-yellow-700">
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
