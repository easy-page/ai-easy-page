import React, { useEffect, useState, useRef } from 'react';

import {
	ConfirmationComponent,
	ToolHeader,
	ToolDetails,
	getStatusDisplay,
} from './components';
import {
	FrontCompletedToolCall,
	FrontToolCall,
	FrontWaitingToolCall,
	ToolCallConfirmationDetails,
	ToolCallRequestInfo,
	ToolCallResponseInfo,
	ToolConfirmationOutcome,
	ToolConfirmationPayload,
} from '../../../common/interfaces/serverChunk';
import { renderApi } from '../../../renderApis';
import { EVENT_NAME } from '../../../common/constants/constant';

// 确认状态类型
interface ConfirmationState {
	isConfirmed: boolean;
	result: {
		outcome: ToolConfirmationOutcome;
		payload?: ToolConfirmationPayload;
	} | null;
}

export interface ToolCardProps {
	id: string;
	messageId: string;
	conversationId: string;
	detail: {
		request?: ToolCallRequestInfo;
		response?: ToolCallResponseInfo;
		output?: {
			toolCallId: string;
			outputChunk: string;
		};
		complete?: FrontCompletedToolCall;
		update?: FrontToolCall;
		startTime?: number;
		endTime?: number;
	};
}

export const ToolCard: React.FC<ToolCardProps> = ({ id, detail }) => {
	const [expanded, setExpanded] = useState(false);
	const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
		{
			isConfirmed: false,
			result: null,
		}
	);
	// 使用 ref 存储最新的确认状态，避免闭包问题
	const confirmationStateRef = useRef<ConfirmationState>(confirmationState);

	// 同步 ref 和 state
	useEffect(() => {
		confirmationStateRef.current = confirmationState;
	}, [confirmationState]);

	console.log('detaildetail:', detail);

	useEffect(() => {
		renderApi.registerPromiseMessageHandler(
			EVENT_NAME.AiToolCallConfirm,

			async (data: { id: string }) => {
				// 等待当前工具确认消息
				console.log('【工具确认】AiToolCallConfirm received:', data);

				// 等待确认状态被设置
				return new Promise((resolve) => {
					const checkConfirmation = () => {
						console.log('【工具确认】 结果：', confirmationStateRef.current);
						if (
							confirmationStateRef.current.isConfirmed &&
							confirmationStateRef.current.result
						) {
							resolve(confirmationStateRef.current.result);
						} else {
							// 继续等待
							setTimeout(checkConfirmation, 100);
						}
					};
					checkConfirmation();
				});
			},
			{
				when: (data) => {
					console.log('【工具确认】匹配到：', data.id === id, data);
					return data.id === id;
				},
			}
		);
	}, [id, detail.update]);

	// 如果有update，优先使用update的信息
	const hasUpdate = !!detail.update;

	// 获取工具信息
	const getToolInfo = () => {
		if (hasUpdate) {
			// update中的request字段包含工具信息
			return detail.update?.request;
		}
		return detail.request;
	};

	const toolInfo = getToolInfo();

	// 状态判断逻辑 - 优先显示确认状态，然后使用update.status
	const getStatus = () => {
		// 如果已经确认，优先显示确认状态
		if (confirmationState.isConfirmed) {
			return 'confirmed';
		}
		if (hasUpdate) {
			return detail.update?.status;
		}
		return 'pending'; // 没有update就是pending状态
	};

	const status = getStatus();

	// 检查是否需要确认
	const needsConfirmation = detail.update?.status === 'awaiting_approval';
	const confirmationDetails = (detail.update as FrontWaitingToolCall)
		?.confirmationDetails as ToolCallConfirmationDetails;

	// 处理确认操作
	const handleConfirm = (
		outcome: ToolConfirmationOutcome,
		payload?: ToolConfirmationPayload
	) => {
		setConfirmationState({
			isConfirmed: true,
			result: { outcome, payload },
		});
	};

	// 输出信息获取
	const getOutputInfo = () => {
		if (hasUpdate) {
			if (detail.update?.status === 'executing') {
				return detail.update.liveOutput;
			}
			if (detail.update?.status === 'success' && 'response' in detail.update) {
				return detail.update.response.resultDisplay;
			}
		}
		return detail.output?.outputChunk;
	};

	const hasOutput = getOutputInfo();

	// 执行时间计算
	const getDuration = () => {
		console.log('update durationMs:', (detail.update as any)?.durationMs);
		console.log('update type:', detail.update?.status);

		if (hasUpdate && (detail.update as any)?.durationMs !== undefined) {
			const durationMs = (detail.update as any).durationMs;
			console.log('Using update durationMs:', durationMs);
			return Math.round(durationMs / 1000);
		}
		if (detail.startTime && detail.endTime) {
			return Math.round((detail.endTime - detail.startTime) / 1000);
		}
		if (detail.startTime) {
			return Math.round((Date.now() - detail.startTime) / 1000);
		}
		return 0;
	};

	const duration = getDuration();
	const statusDisplay = getStatusDisplay(status || '');

	const toggleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<div
			className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border-l-4 mb-2 rounded-lg p-3 hover:shadow-sm transition-all duration-200`}
		>
			{/* 默认显示的一行信息 - 可点击展开 */}
			<div onClick={toggleExpand} className="cursor-pointer">
				<ToolHeader
					toolInfo={toolInfo}
					statusDisplay={statusDisplay}
					duration={duration}
					expanded={expanded}
					onToggleExpand={toggleExpand}
				/>
			</div>

			{/* 确认组件 - 移到外面，始终显示（如果需要确认且未确认） */}
			{needsConfirmation &&
				confirmationDetails &&
				!confirmationState.isConfirmed && (
					<div
						className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
						onClick={(e) => e.stopPropagation()}
					>
						<ConfirmationComponent
							confirmationDetails={confirmationDetails}
							onConfirm={handleConfirm}
						/>
					</div>
				)}

			{/* 展开后的详情内容 */}
			{expanded && (
				<>
					{/* 工具详情 */}
					<ToolDetails
						toolInfo={toolInfo}
						status={status || ''}
						hasOutput={hasOutput}
						hasUpdate={hasUpdate}
						detail={detail}
					/>
				</>
			)}
		</div>
	);
};
