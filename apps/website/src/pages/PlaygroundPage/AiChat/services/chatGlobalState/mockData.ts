import { nanoid } from 'nanoid/non-secure';
import {
	ChatMessageRole,
	ClientMessageFrom,
	ServerMessageCardType,
	ServerMsgType,
} from '@/common/constants/message';
import { ConversationInfo } from '@/common/interfaces/conversation';
import { ConversationMessageType } from '@/common/interfaces/messages/chatMessages/interface';
import { ToolCallStatus } from '@/common/interfaces/messages/chatMessages/client';
import { CurConversation } from './chatGlobalStateEntity';

// 创建基础消息的辅助函数
const createBaseMessage = (conversationId: string) => ({
	id: nanoid(),
	conversation_id: conversationId,
	msg_from: ClientMessageFrom.CLIENT,
	csrf_token: 'mock-csrf-token',
	business_info: {},
});

// 创建用户消息
const createUserMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.USER,
	content,
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建助手消息
const createAssistantMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ASSISTANT,
	type: ServerMsgType.NORMAL,
	content,
	msg_from: ClientMessageFrom.SERVER,
});

// 创建服务器消息
const createServerMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ASSISTANT,
	type: ServerMsgType.NORMAL,
	content,
	msg_from: ClientMessageFrom.SERVER,
	isStreaming: false,
	cards: {
		'task-card-1': {
			type: ServerMessageCardType.TaskCard,
			id: 'task-1',
			detail: {
				taskId: 'task-1',
				title: '示例任务',
				status: 'running',
				progress: 50,
			},
		},
		'doc-card-1': {
			type: ServerMessageCardType.DocCard,
			id: 'doc-1',
			detail: {
				docInfo: '示例文档信息',
			},
		},
	},
});

// 创建推荐消息
const createRecommendMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ASSISTANT,
	content: ['推荐问题1', '推荐问题2', '推荐问题3'],
	type: ServerMsgType.RECOMMAND,
	msg_from: ClientMessageFrom.SERVER,
});

// 创建助手发送到服务器的消息
const createAssistantToServerMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ASSISTANT,
	type: ServerMsgType.NORMAL,
	content,
	msg_from: ClientMessageFrom.SERVER,
});

// 创建用户Shell消息
const createUserShellMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.USER_SHELL,
	content,
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建工具组消息
const createToolGroupMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.TOOL_GROUP,
	content: '工具调用组',
	msg_from: ClientMessageFrom.CLIENT,
	tools: [
		{
			callId: 'tool-1',
			name: 'web_search',
			description: '搜索网络信息',
			resultDisplay: '搜索结果内容',
			status: ToolCallStatus.Success,
			confirmationDetails: undefined,
			renderOutputAsMarkdown: true,
		},
		{
			callId: 'tool-2',
			name: 'file_reader',
			description: '读取文件内容',
			resultDisplay: {
				fileDiff:
					'diff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n 原有内容\n+新增内容\n 其他内容',
				fileName: 'file.txt',
			},
			status: ToolCallStatus.Executing,
			confirmationDetails: {
				type: 'exec',
				title: '确认执行命令',
				onConfirm: async () => {},
				command: 'cat file.txt',
				rootCommand: 'cat',
			},
			renderOutputAsMarkdown: false,
		},
	],
});

// 创建退出消息
const createQuitMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.QUIT,
	content: '会话已结束',
	msg_from: ClientMessageFrom.CLIENT,
	duration: '2分30秒',
});

// 创建模型统计消息
const createModelStatsMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.MODEL_STATS,
	content: '模型使用统计信息',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建工具统计消息
const createToolStatsMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.TOOL_STATS,
	content: '工具使用统计信息',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建统计消息
const createStatsMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.STATS,
	content: '会话统计信息',
	duration: '5分钟',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建关于消息
const createAboutMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ABOUT,
	content: '关于AI助手的信息',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建错误消息
const createErrorMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.ERROR,
	content: '发生了一个错误，请重试',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建信息消息
const createInfoMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.INFO,
	content: '这是一条信息提示',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建模型内容消息
const createModelContentMessage = (
	conversationId: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.MODEL_CONTENT,
	content: '模型生成的内容',
	msg_from: ClientMessageFrom.CLIENT,
});

// 创建第一个会话（当前会话）- 包含所有类型的消息
const createCurrentConversation = (): CurConversation => {
	const conversationId = 'conv-current-001';
	const messages: ConversationMessageType[] = [
		// 用户消息
		createUserMessage(conversationId, '你好，请帮我分析一下这个项目的代码结构'),

		// 助手消息
		createAssistantMessage(
			conversationId,
			'我来帮你分析项目代码结构。首先让我查看一下项目的整体架构。'
		),

		// 服务器消息
		createServerMessage(
			conversationId,
			'我已经分析了你的项目，这是一个基于React的AI营销平台。项目结构清晰，包含了多个核心模块。'
		),

		// 用户Shell消息
		createUserShellMessage(conversationId, 'ls -la src/'),

		// 工具组消息
		createToolGroupMessage(conversationId),

		// 用户消息
		createUserMessage(conversationId, '能详细解释一下每个模块的作用吗？'),

		// 助手发送到服务器的消息
		createAssistantToServerMessage(conversationId, '正在获取详细的项目信息...'),

		// 模型统计消息
		createModelStatsMessage(conversationId),

		// 工具统计消息
		createToolStatsMessage(conversationId),

		// 统计消息
		createStatsMessage(conversationId),

		// 关于消息
		createAboutMessage(conversationId),

		// 错误消息
		createErrorMessage(conversationId),

		// 信息消息
		createInfoMessage(conversationId),

		// 模型内容消息
		createModelContentMessage(conversationId),

		// 推荐消息
		createRecommendMessage(conversationId),

		// 退出消息
		createQuitMessage(conversationId),
	];

	return {
		conversationId,
		displayName: '项目代码结构分析',
		messages,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:30:00Z',
		loaded: true,
		hasMore: false,
	};
};

// 创建第二个会话
const createSecondConversation = (): ConversationInfo => {
	const conversationId = 'conv-second-002';
	const messages: ConversationMessageType[] = [
		createUserMessage(conversationId, '如何优化React组件的性能？'),
		createAssistantMessage(
			conversationId,
			'React组件性能优化有多个方面，包括使用React.memo、useMemo、useCallback等。'
		),
		createServerMessage(
			conversationId,
			'这里是一些具体的优化建议：\n1. 使用React.memo避免不必要的重渲染\n2. 使用useMemo缓存计算结果\n3. 使用useCallback缓存函数引用'
		),
		createToolGroupMessage(conversationId),
		createStatsMessage(conversationId),
	];

	return {
		conversationId,
		displayName: 'React性能优化讨论',
		messages,
		createdAt: '2024-01-14T15:00:00Z',
		updatedAt: '2024-01-14T15:45:00Z',
	};
};

// 导出mock数据
export const mockConversations: ConversationInfo[] = [
	createSecondConversation(),
	createCurrentConversation(),
];

export const mockCurrentConversation: CurConversation =
	createCurrentConversation();

// 导出创建各种消息类型的函数，方便测试使用
export const mockMessageCreators = {
	createUserMessage,
	createAssistantMessage,
	createServerMessage,
	createRecommendMessage,
	createAssistantToServerMessage,
	createUserShellMessage,
	createToolGroupMessage,
	createQuitMessage,
	createModelStatsMessage,
	createToolStatsMessage,
	createStatsMessage,
	createAboutMessage,
	createErrorMessage,
	createInfoMessage,
	createModelContentMessage,
};
