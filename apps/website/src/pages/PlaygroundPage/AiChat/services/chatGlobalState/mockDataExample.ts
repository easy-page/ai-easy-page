import {
	mockConversations,
	mockCurrentConversation,
	mockMessageCreators,
} from './mockData';
import { ChatGlobalStateEntity } from './chatGlobalStateEntity';

/**
 * 使用示例：如何在测试或开发中使用mock数据
 */

// 示例1: 直接使用预定义的mock数据
export const useMockDataExample = () => {
	// 获取所有会话列表
	const allConversations = mockConversations;

	// 获取当前会话（包含所有类型的消息）
	const currentConversation = mockCurrentConversation;

	// 获取特定类型的消息
	const userMessages = currentConversation.messages.filter(
		(msg) => msg.role === 'user'
	);

	const assistantMessages = currentConversation.messages.filter(
		(msg) => msg.role === 'assistant'
	);

	const toolMessages = currentConversation.messages.filter(
		(msg) => msg.role === 'tool_group'
	);

	return {
		allConversations,
		currentConversation,
		userMessages,
		assistantMessages,
		toolMessages,
	};
};

// 示例2: 动态创建新的消息
export const createNewMockMessage = (conversationId: string) => {
	// 创建新的用户消息
	const newUserMessage = mockMessageCreators.createUserMessage(
		conversationId,
		'这是一个新的用户消息'
	);

	// 创建新的助手消息
	const newAssistantMessage = mockMessageCreators.createAssistantMessage(
		conversationId,
		'这是助手的回复消息'
	);

	// 创建工具调用消息
	const newToolMessage =
		mockMessageCreators.createToolGroupMessage(conversationId);

	return {
		newUserMessage,
		newAssistantMessage,
		newToolMessage,
	};
};

// 示例3: 在ChatGlobalStateEntity中使用mock数据
export const setupMockChatState = (chatEntity: ChatGlobalStateEntity) => {
	// 设置当前会话
	chatEntity.setCurConversation(mockCurrentConversation);

	// 设置会话列表
	chatEntity.conversations$.setValue(mockConversations);

	// 设置用户信息
	chatEntity.setUserInfo({
		userId: 'mock-user-001',
		userMis: 'mock-mis',
		userName: '测试用户',
		userAvatar: 'https://example.com/avatar.jpg',
		userEmail: 'test@example.com',
	});

	// 设置团队信息
	chatEntity.setCurTeam({
		id: 1,
		name: '测试团队',
		description: '这是一个测试团队',
		admin_user: 'admin',
		members: 'member1,member2',
		status: 'active',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});
};

// 示例4: 创建自定义会话
export const createCustomConversation = (name: string, messages: any[]) => {
	const conversationId = `conv-custom-${Date.now()}`;

	return {
		conversationId,
		displayName: name,
		messages,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		loaded: true,
		hasMore: false,
	};
};

// 示例5: 消息类型统计
export const getMessageTypeStats = (conversation: any) => {
	const stats = {
		user: 0,
		assistant: 0,
		tool_group: 0,
		server: 0,
		error: 0,
		info: 0,
		stats: 0,
		quit: 0,
		about: 0,
		model_stats: 0,
		tool_stats: 0,
		model_content: 0,
		user_shell: 0,
		recommand: 0,
	};

	conversation.messages.forEach((msg: any) => {
		if (stats.hasOwnProperty(msg.role)) {
			stats[msg.role as keyof typeof stats]++;
		}
	});

	return stats;
};

// 示例6: 获取特定类型的消息
export const getMessagesByType = (conversation: any, messageType: string) => {
	return conversation.messages.filter((msg: any) => msg.role === messageType);
};

// 示例7: 创建测试场景
export const createTestScenario = () => {
	const scenario1 = {
		name: '基础对话场景',
		conversation: mockCurrentConversation,
		description: '包含所有类型消息的完整对话',
	};

	const scenario2 = {
		name: '简单对话场景',
		conversation: mockConversations[1], // 第二个会话
		description: '只包含基本用户和助手消息的简单对话',
	};

	return [scenario1, scenario2];
};

// 示例8: 验证消息完整性
export const validateMessageCompleteness = (conversation: any) => {
	const requiredFields = [
		'id',
		'role',
		'content',
		'msg_from',
		'conversation_id',
	];
	const errors: string[] = [];

	conversation.messages.forEach((msg: any, index: number) => {
		requiredFields.forEach((field) => {
			if (!msg.hasOwnProperty(field)) {
				errors.push(`消息 ${index}: 缺少必需字段 ${field}`);
			}
		});
	});

	return {
		isValid: errors.length === 0,
		errors,
	};
};
