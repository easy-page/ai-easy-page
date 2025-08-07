export enum ChatMessageContextSettingsEnum {
	useDocEditor = 'useDocEditor', // 使用文档编辑器
	useCodeEditor = 'useCodeEditor', // 使用代码编辑器
	useHtml = 'useHtml', // 使用html
	useDeepThinking = 'useDeepThinking', // 使用深度思考
	useWebSearch = 'useWebSearch', // 使用搜索
}

export enum ChatMessageRole {
	/** 用户发送的消息 */
	USER = 'user',
	/** agent 发送的消息 */
	ASSISTANT = 'assistant',
	/** 系统发送的消息，比如：一些进程日志等 */
	SYSTEM = 'system',
	COMPRESSION = 'compression',
	USER_SHELL = 'user_shell',
	TOOL_GROUP = 'tool_group',
	QUIT = 'quit',
	MODEL_STATS = 'model_stats',
	TOOL_STATS = 'tool_stats',
	STATS = 'stats',
	ABOUT = 'about',
	ERROR = 'error',
	INFO = 'info',
	// 同 gemini_content 一样，但是是用户发送的
	MODEL_CONTENT = 'model_content',
}

export enum ServerMessageReactionType {
	LIKE = 1,
	DISLIKE = 2,
	NONE = 0, // 用于取消反应
}

/**
 * - 服务端会给前端返回一些卡片类型消息，可以定义一下
 */
export enum ServerMessageCardType {
	/** 任务卡片 */
	TaskCard = 'TaskCard',
	/** 思考卡片 */
	ThoughtCard = 'ThoughtCard',
	/** 确认卡片 */
	ConfirmCard = 'ConfirmCard',
	/** 错误卡片 */
	ErrorCard = 'ErrorCard',
	/** 文档卡片 */
	DocCard = 'DocCard',
	/** 代码卡片 */
	CodeCard = 'CodeCard',
	/** 网页卡片 */
	WebCard = 'WebCard',
	/** 工具卡片 */
	ToolCard = 'ToolCard',
}
export enum ServerMessageType {
	TEXT = 'TEXT',
	CARD = 'CARD',
}

/** 表示当前消息是卡片输出开始还是结束 */
export enum ServerCardMessageType {
	START = 'START',
	END = 'END',
}

export enum ClientMessageFrom {
	CLIENT = 'client',
	SERVER = 'server',
	ASSISTANT = 'assistant',
}

export enum ServerMsgType {
	RECOMMAND = 'recommand',
	NORMAL = 'normal',
	ERROR = 'error',
}
