import {
	ChatMessageRole,
	ServerMessageCardType,
	ServerMsgType,
} from '../../../constants/message';
import { SimpleTaskInfo } from '../../task';
import { BaseChatMessage } from './common';

export type ServerMsgTaskDetail = SimpleTaskInfo;

export type ServerMsgDocDetail = {
	docInfo: string;
};

export type ServerMsgCodeDetail = {
	codeInfo: string;
};

export type ServerMsgWebDetail = {
	url: string;
};

export type ServerMsgToolResult = {
	status: string;
	error_message: string;
	report: string;
};

export type ServerMsgToolDetail = {
	// toolId: string;

	/** TODO 明确工具调用类型 */
	toolType?: any;
	toolName: string;
	toolParams?: Record<string, any>;
	toolResult?: Record<string, any>;
	startTime?: number;
	endTime?: number;
	duration?: number;
	usage?: any;
};

/** 服务端返回的一些卡片消息，如文件卡片 */
export type ServerMsgCard<T> = {
	type: ServerMessageCardType;
	detail?: T;
	isStream?: boolean;
	content?: string;
	id: string;
};

export interface ServerMessageVersion {
	content: string;
	timestamp: number;
}

/**
 * Agent 给前端回复的消息
 * - content: string 持续的是文本内容
 *   - 如果遇到卡片，则添加卡片形式如下：<CustomCard id="xxxx" props=<%=xxxxProps> />
 *   - 其中 XxxCard 是组件名，XxxCardProps 是卡片组件的 props，通过：cards 里对应名称的组件配置传入
 * - XxxCard 是基础的，如：任务、文档、代码、网页卡片等，需要前端支持即可。
 *  */
export interface ServerMessage extends BaseChatMessage {
	role: ChatMessageRole;
	type: ServerMsgType;

	// 废弃
	thinking?: string;
	content: string;
	liked?: boolean;
	/** 是否正在输出中 */
	isStreaming?: boolean;
	disliked?: boolean;
	cards?: Record<string, ServerMsgCard<any>>;
	versions?: ServerMessageVersion[];
	/** 是否覆盖内容，美团的要覆盖，其他的要拼接 */
	overrideContent?: boolean;
}

/** 独立的推荐消息，放在会话最后的，如果之前有就覆盖，如果没有就加上 */
export interface ServerRecommandMessage extends BaseChatMessage {
	role: ChatMessageRole;
	content: string[];
	type: ServerMsgType.RECOMMAND;
}

// export type ServerMsgStreamResolver = Omit<ServerMessage, 'versions'| 'liked' | 'disliked'> & {

// };
