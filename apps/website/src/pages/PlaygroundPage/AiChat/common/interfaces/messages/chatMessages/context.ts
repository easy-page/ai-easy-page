/**
 * - 消息上下文，包含：文件、场景信息等
 */

import { ChatMessageContextSettingsEnum } from '../../../constants/message';

export enum ChatMessageContextType {
	FILE = 'file',
	LINK = 'link',
	TEXT_FILE = 'textFile', // 文本内容类型的文件
	IMAGE = 'image',
	SENCE = 'sence',
	SETTINGS = 'settings', // 包括：深度思考、搜索资料、文档编辑器、html、pdf、excel、业务展示场景等开关设置
}

export interface BaseMessageContext {
	id: string;
}

export interface LinkMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.LINK;
	link: string;
	linkName?: string;
	https?: boolean;
	icon?: string;
	desc: string;
}

export interface ImageMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.IMAGE;
	mimeType?: string;
	file?: File;
	fileName?: string;
	base64Url?: string;
	size?: number;
	fileUrl?: string;
}

export interface FileMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.FILE;
	mimeType?: string;
	file?: File;
	base64Url?: string;
	size?: number;
	fileName?: string;
	fileUrl?: string;
}

export interface SenceMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.SENCE;
	senceName?: string;
	senceId: string;
	senceDesc?: string;
	icon?: string;
}

export interface TextFileMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.TEXT_FILE;
	fileName?: string;
	fileUrl?: string;
	fileType?: string;
	fileSize?: number;
	textCount?: number;
	icon?: string;
}

export interface SettingsMessageContext extends BaseMessageContext {
	type: ChatMessageContextType.SETTINGS;
	settings: ChatMessageContextSettingsEnum[];
}

export type ChatMessageContext =
	| LinkMessageContext
	| ImageMessageContext
	| FileMessageContext
	| SenceMessageContext
	| TextFileMessageContext
	| SettingsMessageContext;
