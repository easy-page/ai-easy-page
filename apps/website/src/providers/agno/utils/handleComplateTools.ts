import { unRegisterHandlers } from './unRegisterHandlers';
import { mergePartListUnions } from './mergePartListUnions';
import { PartListUnion, Part } from '../../../common/interfaces/message';
import {
	TrackedToolCall,
	TrackedCompletedToolCall,
	TrackedCancelledToolCall,
} from '../../../common/interfaces/serverChunk';
import { renderApi } from '../../../renderApis';

export const doHandleComplateTools =
	({
		addProcessedMemoryTools,
		hasProcessedMemoryTools,
		hasPendingToolCalls,
		setComplated,
		performMemoryRefresh,
		venueId,
	}: {
		addProcessedMemoryTools: (callId: string) => void;
		hasProcessedMemoryTools: (callId: string) => boolean;
		hasPendingToolCalls: () => boolean;
		setComplated: (complated: boolean) => void;
		performMemoryRefresh: () => void;
		venueId: number;
	}) =>
	async (
		completedToolCallsFromScheduler: TrackedToolCall[]
	): Promise<PartListUnion | undefined> => {
		// 判断需要提交给模型的工具执行结果
		const completedAndReadyToSubmitTools =
			completedToolCallsFromScheduler.filter(
				(
					tc: TrackedToolCall
				): tc is TrackedCompletedToolCall | TrackedCancelledToolCall => {
					const isTerminalState =
						tc.status === 'success' ||
						tc.status === 'error' ||
						tc.status === 'cancelled';

					if (isTerminalState) {
						const completedOrCancelledCall = tc as
							| TrackedCompletedToolCall
							| TrackedCancelledToolCall;
						return (
							// TODO: pikun 类型定义
							(completedOrCancelledCall as any).response?.responseParts !==
							undefined
						);
					}
					return false;
				}
			);

		const clientTools = completedAndReadyToSubmitTools.filter(
			(t) => t.request.isClientInitiated
		);
		// if (clientTools.length > 0) {
		// 标记模型结果已经提交给了 model
		// const callIdsToMark = clientTools.map((t) => t.request.callId) || [];
		// }

		const newSuccessfulMemorySaves = completedAndReadyToSubmitTools.filter(
			(t) =>
				t.request.name === 'save_memory' &&
				t.status === 'success' &&
				!hasProcessedMemoryTools(t.request.callId)
		);

		if (newSuccessfulMemorySaves.length > 0) {
			// performMemoryRefresh

			void performMemoryRefresh();

			newSuccessfulMemorySaves.forEach((t) =>
				addProcessedMemoryTools(t.request.callId)
			);
		}

		const geminiTools = completedAndReadyToSubmitTools.filter(
			(t) => !t.request.isClientInitiated
		);

		const finishStream = () => {
			// TODO: 这里应该要等上面那个的执行结果来判断是否取消注册，因为可能还要继续，收敛到： handleComplateTools 最后去吧
			if (!hasPendingToolCalls()) {
				setComplated(true);
				// 清理事件处理器
				unRegisterHandlers();
			}
		};

		if (geminiTools.length === 0) {
			finishStream();
			return;
		}
		const allToolsCancelled = geminiTools.every(
			(tc) => tc.status === 'cancelled'
		);

		if (allToolsCancelled) {
			const responsesToAdd = geminiTools.flatMap(
				(toolCall) => toolCall.response.responseParts
			);
			const combinedParts: Part[] = [];
			for (const response of responsesToAdd) {
				if (Array.isArray(response)) {
					combinedParts.push(...response);
				} else if (typeof response === 'string') {
					combinedParts.push({ text: response });
				} else {
					combinedParts.push(response);
				}
			}
			renderApi.addHistory({
				content: {
					role: 'user',
					parts: combinedParts,
				},
				venueId,
			});
			finishStream();
			return;
		}

		// TODO: pikun 类型定义 toolCall
		const responsesToSend: PartListUnion[] = geminiTools.map(
			(toolCall) => (toolCall as any).response.responseParts
		);
		const callIdsToMarkAsSubmitted = geminiTools.map(
			(toolCall) => toolCall.request.callId
		);

		const prompt_ids = geminiTools.map(
			(toolCall) => toolCall.request.prompt_id
		);

		// 再次调用 createRealTimeStream 继续处理
		// 合并 responsesToSend 为单个 PartListUnion
		const mergedResponses = mergePartListUnions(responsesToSend);
		return mergedResponses;
	};
