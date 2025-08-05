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
				fontSize: '12px',
				lineHeight: '1.5',
				background: '#1e1e1e',
				border: '1px solid #d9d9d9',
				color: '#fff',
				borderRadius: '6px',
				resize: 'none',
			}}
			placeholder={`// 在这里编写${language}代码`}
		/>
	);
};

export default MonacoEditor;
