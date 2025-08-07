# ToolCard 组件

ToolCard 组件用于显示工具调用的状态和详细信息，支持确认流程。

## 组件结构

```
ToolCard/
├── index.tsx                 # 主组件
├── components/               # 子组件目录
│   ├── index.tsx            # 组件导出文件
│   ├── ConfirmationComponent/  # 确认组件目录
│   │   ├── index.tsx        # 确认组件主文件
│   │   ├── ConfirmationContent.tsx  # 确认内容组件
│   │   ├── ConfirmationActions.tsx  # 确认操作组件
│   │   ├── EditConfirmation.tsx     # 编辑确认组件
│   │   ├── ExecConfirmation.tsx     # 执行确认组件
│   │   ├── McpConfirmation.tsx      # MCP确认组件
│   │   └── InfoConfirmation.tsx     # 信息确认组件
│   ├── ToolHeader.tsx       # 工具头部组件
│   ├── ToolDetails.tsx      # 工具详情组件
│   └── StatusDisplay.tsx    # 状态显示组件
└── README.md                # 说明文档
```

## 组件功能

### 主组件 (index.tsx)

- 管理工具调用的整体状态
- 处理确认流程的状态管理
- 协调各个子组件的显示

### 子组件

#### ConfirmationComponent 文件夹

- **index.tsx**: 确认组件的主入口，整合内容和操作
- **ConfirmationContent.tsx**: 根据不同类型渲染对应的确认内容
- **ConfirmationActions.tsx**: 处理确认、取消、编辑等操作按钮
- **EditConfirmation.tsx**: 处理文件编辑类型的确认
- **ExecConfirmation.tsx**: 处理命令执行类型的确认
- **McpConfirmation.tsx**: 处理 MCP 工具类型的确认
- **InfoConfirmation.tsx**: 处理信息提示类型的确认

#### ToolHeader

- 显示工具名称、状态、执行时间等基本信息
- 处理展开/收起交互

#### ToolDetails

- 显示工具参数、输出结果、错误信息等详细信息
- 显示执行时间和用户发起标识

#### StatusDisplay

- 提供不同状态的显示配置
- 包括图标、颜色、标签等样式信息

## 状态管理

组件使用 `ConfirmationState` 来管理确认状态：

```typescript
interface ConfirmationState {
	isConfirmed: boolean;
	result: {
		outcome: ToolConfirmationOutcome;
		payload?: ToolConfirmationPayload;
	} | null;
}
```

## 确认流程

1. 检查 `detail.update?.status === 'awaiting_approval'`
2. 如果需要确认，显示确认组件
3. 用户操作后设置确认状态
4. 等待确认完成后返回结果

## 确认类型

支持四种确认类型：

- **edit**: 文件编辑确认，显示文件差异
- **exec**: 命令执行确认，显示要执行的命令
- **mcp**: MCP 工具确认，显示服务器和工具信息
- **info**: 信息提示确认，显示提示信息和相关链接

## 使用方式

```tsx
<ToolCard
	id="tool-call-id"
	messageId="message-id"
	conversationId="conversation-id"
	detail={toolCallDetail}
/>
```
