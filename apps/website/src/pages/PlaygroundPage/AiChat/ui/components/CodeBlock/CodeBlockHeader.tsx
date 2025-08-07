import { Button } from '@/views/aiChat/baseUi/components/button';
import { Icons } from '@/views/aiChat/baseUi/components/icons';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/views/aiChat/baseUi/components/tooltip';
import { FC, useState } from 'react';

export type CodeHeaderProps = {
	language: string | undefined;
	code: string;
};

const useCopyToClipboard = ({
	copiedDuration = 3000,
}: {
	copiedDuration?: number;
} = {}) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	const copyToClipboard = (value: string) => {
		if (!value) return;

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), copiedDuration);
		});
	};

	return { isCopied, copyToClipboard };
};

export const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
	const { isCopied, copyToClipboard } = useCopyToClipboard();
	const onCopy = () => {
		if (!code || isCopied) return;
		copyToClipboard(code);
	};

	return (
		<div className="flex items-center justify-between gap-4 rounded-t-lg bg-muted/40 border-b px-2 py-1 mb-1 text-sm font-semibold text-muted-foreground">
			<span className="lowercase [&>span]:text-xs">{language}</span>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="h-6 w-6 p-1 hover:bg-muted/60 "
							onClick={onCopy}
						>
							{isCopied ? (
								<Icons.Check className="h-4 w-4 text-green-500" />
							) : (
								<Icons.Copy className="h-4 w-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>复制</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
