import { ServerMessageReactionType } from '@/common/constants/message';
import { ServerMessage } from '@/common/interfaces/messages/chatMessages/server';
import { getQueryString } from '@/common/utils/url';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { Button } from '@/views/aiChat/baseUi/components/button';
import { Icons } from '@/views/aiChat/baseUi/components/icons';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/views/aiChat/baseUi/components/tooltip';
import { cn } from '@/views/aiChat/baseUi/utils';
import { useMemo, useState } from 'react';

export type AssistantMessageToolbarProps = {
	message: ServerMessage;
	isLastMsg?: boolean;
	currentVersion: number;
	setCurrentVersion: React.Dispatch<React.SetStateAction<number>>;
	chatService: ChatService;
};
export const AssistantMessageToolbar = ({
	message,
	isLastMsg,
	currentVersion,
	setCurrentVersion,
	chatService,
}: AssistantMessageToolbarProps) => {
	const [isCopied, setIsCopied] = useState(false);

	const conversationId = getQueryString('chatId');
	const curMessages = useMemo(() => {
		const versions = (message.versions || []).map((item) => item.content);
		return [...versions, message.content];
	}, [message]);
	function handleCopyClick() {
		const text = message.content;
		navigator.clipboard.writeText(text);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	}

	function handleRetry() {
		// chatService.regenerateMessage(message);
	}

	function handleVersionChange(direction: 'prev' | 'next') {
		if (curMessages.length === 1) return;

		if (direction === 'prev') {
			setCurrentVersion((curr) => Math.max(0, curr - 1));
		} else {
			setCurrentVersion((curr) => Math.min(curMessages.length - 1, curr + 1));
		}
	}

	// 点、踩
	async function handleReaction(type: ServerMessageReactionType) {
		if (!conversationId) {
			console.error('conversationId is null');
			return;
		}
		try {
			// await chatService.reactToMessage(conversationId, message, type);
		} catch (error) {
			console.error('反馈失败:', error);
		}
	}
	if (message.isStreaming) {
		return <></>;
	}

	return (
		<div className="flex opacity-0 group-hover:opacity-100  transition-opacity justify-start  pr-2 gap-2  duration-200 z-10 ">
			<div className="flex gap-2 items-center">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={handleCopyClick}
								size="icon"
								variant="ghost"
								className="h-6 w-6 p-1 hover:bg-muted/60 "
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
				{/* {isLastMsg && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleRetry}
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 p-1 hover:bg-muted/60 "
                                >
                                    <Icons.Reload className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>重新生成</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )} */}

				{/* {curMessages.length > 1 && isLastMsg && (
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleVersionChange('prev')}
                            disabled={currentVersion === 0}
                            className="h-6 w-6 p-1 hover:bg-muted/60  flex items-center justify-center disabled:hover:bg-transparent"
                        >
                            <Icons.ChevronLeft className="h-4 w-4 relative right-[1px]" />
                        </Button>
                        <span className="w-[2.5rem] text-center flex justify-center gap-1">
                            <span
                                className={cn(currentVersion === 0 && 'text-muted-foreground/40')}
                            >
                                {currentVersion + 1}
                            </span>
                            <span>/</span>
                            <span
                                className={cn(
                                    currentVersion === curMessages.length - 1 &&
                                        'text-muted-foreground/40'
                                )}
                            >
                                {curMessages.length}
                            </span>
                        </span>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleVersionChange('next')}
                            disabled={currentVersion === curMessages.length - 1}
                            className="h-6 w-6 p-1 hover:bg-muted/60  flex items-center justify-center disabled:hover:bg-transparent"
                        >
                            <Icons.ChevronRight className="h-4 w-4 relative left-[1px]" />
                        </Button>
                    </div>
                )} */}
			</div>
		</div>
	);
};

{
	/* <div className="w-[1px] h-4 bg-border self-center" />
<div className="flex gap-2">
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={() => handleReaction(ServerMessageReactionType.LIKE)}
                    size="icon"
                    variant="ghost"
                    className={cn(
                        'h-6 w-6 items-center flex hover:bg-muted/60',
                        message?.liked && 'text-primary'
                    )}
                >
                    {message?.liked ? (
                        <Icons.ThumbsUpFilled className="h-4 w-4" />
                    ) : (
                        <Icons.ThumbsUp className="h-4 w-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>点赞</TooltipContent>
        </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={() => handleReaction(ServerMessageReactionType.DISLIKE)}
                    size="icon"
                    variant="ghost"
                    className={cn(
                        'h-6 w-6  items-center flex hover:bg-muted/60',
                        message?.disliked && 'text-destructive'
                    )}
                >
                    {message?.disliked ? (
                        <Icons.ThumbsDownFilled className="h-4 w-4" />
                    ) : (
                        <Icons.ThumbsDown className="h-4 w-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>点踩</TooltipContent>
        </Tooltip>
    </TooltipProvider>
</div> */
}
