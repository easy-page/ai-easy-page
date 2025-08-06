import React, { FC } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	height?: string;
	readOnly?: boolean;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
	value,
	onChange,
	language = 'javascript',
	height = '200px',
	readOnly = false,
}) => {
	return (
		<TextArea
			value={value}
			onChange={(e) => onChange(e.target.value)}
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
			onBlur={(e) => {
				e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)';
				e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
			}}
			placeholder={`// 在这里编写${language}代码`}
		/>
	);
};

export default MonacoEditor;
