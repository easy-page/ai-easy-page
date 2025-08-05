import { FC } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface MonacoEditorProps {
	value: string;
	language: string;
	placeholder?: string;
	onChange: (value: string) => void;
	height?: number;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
	value,
	language,
	placeholder,
	onChange,
	height = 200,
}) => {
	return (
		<TextArea
			value={value}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			style={{
				height: `${height}px`,
				fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
				fontSize: '12px',
				lineHeight: '1.5',
				background: 'rgba(255, 255, 255, 0.05)',
				border: '1px solid rgba(0, 255, 255, 0.3)',
				color: '#fff',
				borderRadius: '6px',
				resize: 'none',
			}}
		/>
	);
};

export default MonacoEditor;
