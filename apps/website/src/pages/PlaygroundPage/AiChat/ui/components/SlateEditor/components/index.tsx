import React from 'react';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { ELEMENT_TYPES } from '../constants';

// 导入各种组件
import { ParagraphElement, ParagraphElementComponent } from './PragraphElement';
import { SenceElement, SenceElementComponent } from './SenceElement';
import { ChatService } from '@/services/chatGlobalState';
import { CustomRenderElementProps } from '../interface';
import { InputElement, InputElementComponent } from './InputElement';
import { UploadElement, UploadElementComponent } from './UploadElement';

export type CustomText = {
	text: string;
};

declare module 'slate' {
	interface CustomTypes {
		Editor: ReactEditor;
		Element: SenceElement | ParagraphElement | InputElement | UploadElement;
		Text: CustomText;
	}
}

// 渲染不同类型的元素
export const renderElement = (props: CustomRenderElementProps) => {
	const { attributes, children, element } = props;

	switch (element.type) {
		case ELEMENT_TYPES.UPLOAD_FILE:
			return <UploadElementComponent {...props} />;
		case ELEMENT_TYPES.INPUT:
			return <InputElementComponent {...props} />;
		case ELEMENT_TYPES.SENCE:
			return <SenceElementComponent {...props} />;
		case ELEMENT_TYPES.PARAGRAPH:
			return <ParagraphElementComponent {...props} />;
		default:
			return <ParagraphElementComponent {...props} />;
	}
};

// 导出所有组件，方便外部直接使用
export * from './PragraphElement';
export * from './SenceElement';
