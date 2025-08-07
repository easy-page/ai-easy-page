import { PartListUnion } from '@shared/message';

export const prepareQueryForGemini = async (
	query: PartListUnion,
	userMessageTimestamp: number,
	abortSignal: AbortSignal,
	prompt_id: string
): Promise<{
	queryToSend: PartListUnion | null;
	shouldProceed: boolean;
}> => {
	// TODO: 这里是否需要判断
	// if (turnCancelledRef.current) {
	// 	return { queryToSend: null, shouldProceed: false };
	// }
	if (typeof query === 'string' && query.trim().length === 0) {
		return { queryToSend: null, shouldProceed: false };
	}

	let localQueryToSendToGemini: PartListUnion | null = null;
	if (typeof query === 'string') {
		const trimmedQuery = query.trim();
		// TODO：这里的日志记录，需要实现通信，将相关的参数传递过去
		// logUserPrompt(
		//   config,
		//   new UserPromptEvent(trimmedQuery.length, prompt_id, trimmedQuery),
		// );
		// onDebugMessage(`User query: '${trimmedQuery}'`);
		// await logger?.logMessage(MessageSenderType.USER, trimmedQuery);

		// TODO: handleSlashCommand 处理输入的参数如：@ 或者是 / 等暂时不需要

		// TODO：处理 handleShellCommand 命令执行，需要用主进程通信去执行

		// TODO: 处理 isAtCommand 命令执行，需要用主进程通信去执行

		localQueryToSendToGemini = trimmedQuery;
	} else {
		localQueryToSendToGemini = query;
	}

	if (localQueryToSendToGemini == null) {
		return { queryToSend: null, shouldProceed: false };
	}

	return { queryToSend: localQueryToSendToGemini, shouldProceed: true };
};
