import React, { useCallback, useMemo, useState } from 'react';
import { Descendant, Transforms } from 'slate';
import { Slate, Editable, ReactEditor } from 'slate-react';
import styled from 'styled-components';
import { PARAGRAPH_ELEMENT, renderElement } from './components';
import { ChatService } from '../../../services/chatGlobalState';
import { useObservable } from '../../../hooks/useObservable';

// 样式组件
const EditorContainer = styled.div`
	padding: 8px 16px;
	min-height: 150px;
	border: 1px solid hsl(var(--border-brand));
	border-radius: var(--radius);
`;

// 自定义样式，解决placeholder问题
const StyledEditable = styled(Editable)`
	min-height: 24px;
	line-height: 1.5;
	outline: none;
`;

interface SlateEditorProps {
	initValue?: Descendant[];
	onSend?: (value: ReactEditor) => void;
	placeholder?: string;
	chatService: ChatService;
	editor: ReactEditor;
}

const initialValue: Descendant[] = [
	{
		type: PARAGRAPH_ELEMENT,
		children: [{ text: '' }],
	},
];

export const isEmptyContent = (value: Descendant[]) => {
	if (value.length === 0) {
		return true;
	}
	const first = value[0] as any;
	if (value.length === 1 && first?.children?.length === 1) {
		return (first.children[0] as any)?.text === '';
	}
	console.log('asdsadsad:', value);
	return false;
};

export const SlateEditor: React.FC<SlateEditorProps> = ({
	initValue = initialValue,
	onSend,
	chatService,
	placeholder,
	editor,
}) => {
	const isEmpty = useObservable(chatService.globalState.isEmptyInput$, true);
	// 新增：用于判断是否处于中文输入法组合状态
	const [isComposing, setIsComposing] = useState(false);
	const [compositionText, setCompositionText] = useState('');

	// 自定义键盘快捷键处理
	const handleKeyDown = (event: React.KeyboardEvent) => {
		// 只处理 Enter 发送
		if (event.key === 'Enter') {
			if (event.shiftKey) {
				// Shift+Enter允许换行
				return;
			} else {
				event.preventDefault();
				event.stopPropagation();
				handleSend();
			}
		}
		// 其它按键（包括空格）都不处理
	};

	// 发送内容方法
	const handleSend = useCallback(() => {
		if (onSend) {
			onSend(editor);
		}
	}, [editor, onSend]);

	return (
		<Slate
			editor={editor}
			initialValue={initValue}
			onChange={(val) => {
				console.log('onChange:', val);
				// 在输入法组合状态下，不更新 isEmpty 状态
				const empty = isEmptyContent(val);
				console.log('onChange:', empty);
				if (empty !== isEmpty) {
					chatService.globalState.setIsEmptyInput(empty);
				}
			}}
		>
			<StyledEditable
				className="slate-editor"
				renderElement={(props) => renderElement({ ...props, chatService })}
				placeholder={placeholder || '开始输入内容'}
				onKeyDown={handleKeyDown}
				onPaste={(event) => {
					event.preventDefault();
					const text = event.clipboardData.getData('text/plain');
					// 将换行符替换为中文逗号
					const processedText = text.replace(/[\r\n]+/g, '，');
					// 使用 Slate 的 API 插入文本
					const { selection } = editor;
					if (selection) {
						Transforms.insertText(editor, processedText);
					}
				}}
			/>
		</Slate>
	);
};
