import ReactMarkdown from 'react-markdown';
import { CodeOverride } from './CodeOverride';
import { CodeHeader } from './CodeBlockHeader';
import { DefaultCodeBlockContent } from './defaultComponents';
import {
	a11yDark,
	oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { makePrismAsyncSyntaxHighlighter } from './react-syntax-highlighter';
import { PreOverride } from './PreOverride';
import { useTheme } from '@/theme';

export const CollapseCodeBlock = (props: any) => {
	console.log('SyntaxHighlighter 0', props);
	const { theme } = useTheme();
	const SyntaxHighlighter = makePrismAsyncSyntaxHighlighter({
		style: theme !== 'light' ? oneLight : a11yDark,
		customStyle: {
			margin: 0,
			background: 'transparent',
			color: 'inherit',
		},
	});
	return (
		<div className="bg-muted rounded-lg p-2 overflow-hidden">
			<CodeOverride
				components={{
					Pre: PreOverride,
					SyntaxHighlighter: SyntaxHighlighter,
					CodeHeader: CodeHeader,
					Code: ({ node, className, children, ...props }) => {
						const match = /language-(\w+)(:?.+)?/.exec(className || '');
						const rawLanguage = match?.[1];
						const filePath = match?.[2]?.substring(1);
						const codeContent = String(children).replace(/\n$/, '');
						console.log(
							'codeContent',
							match && filePath,
							rawLanguage,
							codeContent
						);
						return (
							<code className={'bg-muted text-inherit'} {...props}>
								{children}
							</code>
						);
					},
				}}
				componentsByLanguage={{}}
				{...props}
			/>
		</div>
	);
};
