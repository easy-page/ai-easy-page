import React, { FC, useRef, useEffect, useState } from 'react';
import { Input } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';

const { TextArea } = Input;

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	height?: string;
	readOnly?: boolean;
	// 当为 true 时，不在 onChange 立即回调，仅在 onBlur 时同步给外部
	updateOnBlur?: boolean;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
	value,
	onChange,
	language = 'javascript',
	height = '200px',
	readOnly = false,
	updateOnBlur = true,
}) => {
	const textareaRef = useRef<TextAreaRef>(null);
	const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);
	const [innerValue, setInnerValue] = useState<string>(value);

	// 外部 value 变化时同步到内部
	useEffect(() => {
		setInnerValue(value);
		// 若外部驱动更新，同步后恢复光标
		if (cursorPositionRef.current) {
			setTimeout(restoreCursorPosition, 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	// 保存光标位置
	const getNativeTextarea = (): HTMLTextAreaElement | null => {
		const native = textareaRef.current?.resizableTextArea?.textArea as
			| HTMLTextAreaElement
			| undefined;
		return native ?? null;
	};

	const saveCursorPosition = () => {
		const native = getNativeTextarea();
		if (native) {
			cursorPositionRef.current = {
				start: native.selectionStart ?? 0,
				end: native.selectionEnd ?? 0,
			};
		}
	};

	// 恢复光标位置
	const restoreCursorPosition = () => {
		const native = getNativeTextarea();
		if (native && cursorPositionRef.current) {
			const { start, end } = cursorPositionRef.current;
			const maxPos = native.value.length;
			const safeStart = Math.min(start, maxPos);
			const safeEnd = Math.min(end, maxPos);
			native.setSelectionRange(safeStart, safeEnd);
			native.focus();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		// 在值变化前保存光标位置
		saveCursorPosition();
		const next = e.target.value;
		setInnerValue(next);
		if (!updateOnBlur) {
			onChange(next);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		// 仅在失焦时把内部值同步给外部
		if (updateOnBlur) {
			onChange(innerValue);
		}
		// 恢复样式（沿用原有逻辑）
		e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)';
		e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
	};

	return (
		<TextArea
			ref={textareaRef}
			value={innerValue}
			onChange={handleChange}
			onSelect={saveCursorPosition}
			onClick={saveCursorPosition}
			onKeyUp={saveCursorPosition}
			readOnly={readOnly}
			style={{
				height,
				fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
				fontSize: '13px',
				lineHeight: '1.6',
				background: 'rgba(30, 30, 30, 0.8)',
				border: '1px solid rgba(0, 255, 255, 0.3)',
				color: '#e6e6e6',
				borderRadius: '8px',
				resize: 'none',
				padding: '12px',
				boxSizing: 'border-box',
				transition: 'all 0.3s ease',
				boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
			}}
			onFocus={(e) => {
				e.target.style.borderColor = 'rgba(0, 255, 255, 0.6)';
				e.target.style.boxShadow =
					'inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(0, 255, 255, 0.1)';
			}}
			onBlur={handleBlur}
			placeholder={`// 在这里编写${language}代码`}
		/>
	);
};

export default MonacoEditor;
