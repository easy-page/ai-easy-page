import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

const { Text } = Typography;

interface ToolHeaderProps {
	toolInfo?: {
		name?: string;
		callId?: string;
		isClientInitiated?: boolean;
	};
	statusDisplay: {
		tag: React.ReactNode;
		icon: React.ReactNode;
		borderColor: string;
		bgColor: string;
		textColor: string;
	};
	duration: number;
	expanded: boolean;
	onToggleExpand: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
	toolInfo,
	statusDisplay,
	duration,
	expanded,
	onToggleExpand,
}) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3 flex-1 min-w-0">
				{statusDisplay.icon}
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<Text strong className={`${statusDisplay.textColor} truncate`}>
						{toolInfo?.name || '工具调用'}
					</Text>
					{toolInfo?.callId && (
						<Text className="text-foreground-secondary text-xs flex-shrink-0">
							#{toolInfo.callId.slice(-8)}
						</Text>
					)}
				</div>
			</div>
			<div className="flex items-center gap-3 flex-shrink-0">
				<div className="flex items-center gap-1">
					<svg
						className="text-foreground-secondary w-3 h-3"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clipRule="evenodd"
						/>
					</svg>
					<Text className="text-foreground-secondary text-xs">
						{duration}秒
					</Text>
				</div>
				{statusDisplay.tag}
				<button
					onClick={(e) => {
						e.stopPropagation();
						onToggleExpand();
					}}
					className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
				>
					<svg
						className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
							expanded ? 'rotate-180' : ''
						}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
