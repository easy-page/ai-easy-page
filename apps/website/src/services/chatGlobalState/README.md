# Chat Global State Mock 数据

这个目录包含了用于测试和开发 UI 组件的 mock 数据，涵盖了所有 `ConversationMessageType` 类型的消息。

## 文件结构

- `mockData.ts` - 主要的 mock 数据文件，包含所有类型的消息和会话
- `mockDataExample.ts` - 使用示例和工具函数
- `README.md` - 本文档

## 消息类型覆盖

当前 mock 数据包含了以下所有 `ConversationMessageType` 类型的消息：

### 客户端消息类型

1. **UserClientMessage** - 用户发送的消息
2. **AssistantClientMessage** - 助手发送的消息
3. **UserShellClientMessage** - 用户 Shell 命令消息
4. **ToolGroupClientMessage** - 工具组消息（包含工具调用）
5. **QuitClientMessage** - 退出消息
6. **ModelStatsClientMessage** - 模型统计消息
7. **ToolStatsClientMessage** - 工具统计消息
8. **StatsClientMessage** - 统计消息
9. **AboutClientMessage** - 关于消息
10. **ErrorClientMessage** - 错误消息
11. **InfoClientMessage** - 信息消息
12. **ModelContentClientMessage** - 模型内容消息

### 服务器消息类型

13. **ServerMessage** - 服务器消息（包含卡片）
14. **ServerRecommandMessage** - 推荐消息
15. **AssistantClientMessageToServer** - 助手发送到服务器的消息

## 数据结构

### 会话结构

```typescript
interface CurConversation {
	conversationId: string;
	displayName: string;
	messages: ConversationMessageType[];
	createdAt: string;
	updatedAt: string;
	loaded: boolean;
	hasMore?: boolean;
}
```

### 消息基础结构

```typescript
interface BaseChatMessage {
	id?: string;
	msg_from: ClientMessageFrom;
	conversation_id: string;
	csrf_token?: string;
	business_info?: Record<string, any>;
}
```

## 使用方法

### 1. 直接使用预定义数据

```typescript
import { mockConversations, mockCurrentConversation } from './mockData';

// 获取所有会话
const allConversations = mockConversations;

// 获取当前会话（包含所有类型的消息）
const currentConversation = mockCurrentConversation;
```

### 2. 动态创建消息

```typescript
import { mockMessageCreators } from './mockData';

const conversationId = 'conv-001';

// 创建用户消息
const userMessage = mockMessageCreators.createUserMessage(
	conversationId,
	'你好，请帮我分析代码'
);

// 创建助手消息
const assistantMessage = mockMessageCreators.createAssistantMessage(
	conversationId,
	'我来帮你分析代码结构'
);

// 创建工具组消息
const toolMessage = mockMessageCreators.createToolGroupMessage(conversationId);
```

### 3. 在 ChatGlobalStateEntity 中使用

```typescript
import { setupMockChatState } from './mockDataExample';

// 设置mock数据到全局状态
setupMockChatState(chatEntity);
```

### 4. 获取特定类型的消息

```typescript
import { getMessagesByType } from './mockDataExample';

// 获取所有用户消息
const userMessages = getMessagesByType(currentConversation, 'user');

// 获取所有工具消息
const toolMessages = getMessagesByType(currentConversation, 'tool_group');
```

### 5. 消息类型统计

```typescript
import { getMessageTypeStats } from './mockDataExample';

// 获取消息类型统计
const stats = getMessageTypeStats(currentConversation);
console.log(stats);
// 输出: { user: 2, assistant: 2, tool_group: 1, ... }
```

## 测试场景

### 场景 1: 完整对话测试

使用 `mockCurrentConversation` 进行完整对话测试，包含所有类型的消息。

### 场景 2: 简单对话测试

使用 `mockConversations[1]` 进行简单对话测试，只包含基本的用户和助手消息。

### 场景 3: 工具调用测试

使用工具组消息测试工具调用的 UI 渲染。

### 场景 4: 错误处理测试

使用错误消息和信息消息测试错误处理 UI。

## 自定义扩展

### 创建新的消息类型

```typescript
// 在 mockData.ts 中添加新的创建函数
const createCustomMessage = (
	conversationId: string,
	content: string
): ConversationMessageType => ({
	...createBaseMessage(conversationId),
	role: ChatMessageRole.CUSTOM,
	content,
	msg_from: ClientMessageFrom.CLIENT,
});

// 导出到 mockMessageCreators
export const mockMessageCreators = {
	// ... 其他创建函数
	createCustomMessage,
};
```

### 创建自定义会话

```typescript
import { createCustomConversation } from './mockDataExample';

const customMessages = [
	// 你的自定义消息
];

const customConversation = createCustomConversation(
	'自定义会话',
	customMessages
);
```

## 注意事项

1. **类型安全**: 所有 mock 数据都遵循 TypeScript 类型定义，确保类型安全。

2. **ID 唯一性**: 使用 `nanoid` 生成唯一的消息 ID。

3. **时间戳**: 使用 ISO 格式的时间戳，便于排序和显示。

4. **工具调用**: 工具组消息包含完整的工具调用信息，包括状态、结果显示等。

5. **卡片支持**: 服务器消息支持各种类型的卡片（任务、文档、代码等）。

## 验证数据完整性

```typescript
import { validateMessageCompleteness } from './mockDataExample';

const validation = validateMessageCompleteness(currentConversation);
if (!validation.isValid) {
	console.error('数据验证失败:', validation.errors);
}
```

## 贡献指南

当添加新的消息类型时，请：

1. 在 `mockData.ts` 中添加对应的创建函数
2. 在 `mockDataExample.ts` 中添加使用示例
3. 更新本文档
4. 确保所有类型检查通过
