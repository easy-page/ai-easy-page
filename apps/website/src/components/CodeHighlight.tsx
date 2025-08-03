import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlightProps {
	language: string;
	children: string;
	showLineNumbers?: boolean;
	customStyle?: React.CSSProperties;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({
	language,
	children,
	showLineNumbers = false,
	customStyle = {},
}) => {
	const defaultStyle = {
		background: 'transparent',
		border: 'none',
		borderRadius: '0',
		padding: '0',
		margin: '0',
		fontSize: '14px',
		lineHeight: '1.5',
		overflow: 'visible',
		width: '100%',
		...customStyle,
	};

	return (
		<SyntaxHighlighter
			language={language}
			style={vscDarkPlus}
			customStyle={defaultStyle}
			showLineNumbers={showLineNumbers}
			PreTag="div"
			wrapLines={true}
			wrapLongLines={true}
		>
			{children}
		</SyntaxHighlighter>
	);
};

export default CodeHighlight;
