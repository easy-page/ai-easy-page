import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeHighlight from './CodeHighlight';

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	content,
	className = 'markdown-content',
}) => {
	return (
		<div className={className}>
			<ReactMarkdown
				components={{
					code({ inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						const language = match ? match[1] : 'text';

						return !inline ? (
							<div className={`code-block language-${language}`}>
								<CodeHighlight language={language}>
									{String(children).replace(/\n$/, '')}
								</CodeHighlight>
							</div>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
