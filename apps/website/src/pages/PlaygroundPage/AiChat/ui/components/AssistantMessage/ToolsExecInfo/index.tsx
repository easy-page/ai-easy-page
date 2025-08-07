import { Tag, Spin } from '@douyinfe/semi-ui';
import {
	ServerMsgCard,
	ServerMsgToolDetail,
} from '@/common/interfaces/messages/chatMessages/server';
import { Icons } from '@/views/aiChat/baseUi/components/icons';
export type ToolsExecInfoProps = {
	toolInfo?: ServerMsgCard<ServerMsgToolDetail>;
};

const getStatusTag = (status: string) => {
	switch (status) {
		case 'success':
			return <Tag color="green">成功</Tag>;
		case 'error':
			return <Tag color="red">失败</Tag>;
		default:
			return <Tag color="blue">运行中</Tag>;
	}
};

export const ToolsExecInfo = ({ toolInfo }: ToolsExecInfoProps) => {
	console.log('ToolsExecInfotools', toolInfo);
	if (!toolInfo || !toolInfo.detail) {
		return <></>;
	}

	const duration = toolInfo.detail?.duration
		? Math.round(parseFloat(toolInfo.detail.duration as any))
		: 0;
	console.log('toolInfo.detail', toolInfo.detail);
	const isRunning = !toolInfo.detail?.endTime;
	return (
		<div className="mb-2 overflow-x-auto ">
			<div className="flex gap-4 min-w-max cursor-pointer">
				<div
					key={toolInfo.id}
					className="flex-shrink-0 w-60 px-4 py-2 border rounded-lg shadow-sm hover:bg-background-hover transition-colors duration-200"
				>
					<div className="flex flex-row justify-between">
						<div className="flex items-center gap-2 mb-2">
							{isRunning ? (
								<Spin size="small" />
							) : (
								<Icons.Sun className="text-green-500" />
							)}
							<div className="font-medium text-foreground-primary">
								{toolInfo.detail.toolName}
							</div>
						</div>
						<div className="flex items-center gap-2">
							{getStatusTag(toolInfo.detail.toolResult?.status || '')}
						</div>
					</div>

					<span className="text-foreground-secondary text-mini">
						执行时间：{duration.toString()}秒
					</span>
				</div>
			</div>
		</div>
	);
};
