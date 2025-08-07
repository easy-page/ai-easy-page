import React from 'react';
import NodeIcon from './NodeIcon';
import {
	ChatMessageContext,
	ChatMessageContextType,
} from '@/common/interfaces/messages/chatMessages/context';
import { Icons } from '@/views/aiChat/baseUi/components/icons';

function isWindows() {
	const userAgent = navigator.userAgent;
	return /Windows/i.test(userAgent);
}
export const platformSlash = isWindows() ? '\\' : '/';
function getTruncatedFileName(fileName: string) {
	const parts = fileName.split(platformSlash);
	return parts[parts.length - 1];
}
export function getTruncatedName(context: ChatMessageContext) {
	let name = '';
	if (
		context.type === ChatMessageContextType.FILE ||
		context.type === ChatMessageContextType.IMAGE
	) {
		name = getTruncatedFileName(name);
	}
	return name.length > 20 ? `${name.slice(0, 20)}...` : name;
}

export function getContextIcon(context: ChatMessageContext) {
	let icon: React.ComponentType | React.ReactElement | null = null;
	switch (context.type) {
		case ChatMessageContextType.FILE:
			icon = Icons.File;
			break;
		case ChatMessageContextType.IMAGE:
			icon = Icons.Image;
			break;
	}
	if (icon) {
		return React.createElement(icon);
	}
}
