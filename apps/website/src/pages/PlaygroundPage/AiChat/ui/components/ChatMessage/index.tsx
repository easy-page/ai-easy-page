import {
	UserClientMessage,
	AssistantClientMessage,
} from '../../../common/interfaces/messages/chatMessages/client';
import {
	ChatMessageContext,
	ChatMessageContextType,
} from '../../../common/interfaces/messages/chatMessages/context';
import { useService } from '../../../infra';
import { ChatService } from '../../../services/chatGlobalState';
import { Button } from '../../baseUi/components/button';
import { Icons } from '../../baseUi/components/icons';
import { Textarea } from '../../baseUi/components/textarea';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../baseUi/components/tooltip';
import { useEffect, useRef, useState } from 'react';
import { FileContextList } from './components/FileContextList';

export type ChatClientMessageProps = {
	message: UserClientMessage | AssistantClientMessage;
};

export const ChatClientMessage = ({ message }: ChatClientMessageProps) => {
	const chatService = useService(ChatService);
	const [isCopied, setIsCopied] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState('');
	const [isComposing, setIsComposing] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			textareaRef.current.focus();
			textareaRef.current.setSelectionRange(editValue.length, editValue.length);
		}
	}, [isEditing, editValue]);

	const handleEditClick = () => {
		setEditValue(message.content);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditValue('');
	};

	const handleSubmit = () => {
		// chatService.resubmitMessage(message.id, editValue);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
			e.preventDefault();
			handleSubmit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			handleCancel();
		}
	};

	function handleCopyClick() {
		const text = message.content;
		navigator.clipboard.writeText(text);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	}

	const handleRetry = () => {
		// chatService.resubmitMessage(message.id, message.content);
	};

	function renderEditingInput() {
		return (
			<div className="flex flex-col">
				<Textarea
					ref={textareaRef}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					className="text-small border-none resize-none px-0 mt-[-8px]"
					rows={2}
					onKeyDown={handleKeyDown}
					onCompositionStart={() => setIsComposing(true)}
					onCompositionEnd={() => setIsComposing(false)}
				/>
				<div className="flex justify-end gap-2">
					<Button size="sm" variant={'ghost'} onClick={handleCancel}>
						取消
					</Button>
					<Button size="sm" variant={'outline'} onClick={handleSubmit}>
						确定
					</Button>
				</div>
			</div>
		);
	}

	function renderContent() {
		return <div className="text-small break-all">{message.content}</div>;
	}

	function renderButtons() {
		return (
			<div className="flex justify-end  mt-2 pr-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
				{/* <Tooltip>
                  <TooltipTrigger asChild>
                      <Button
                          onClick={handleRetry}
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 p-1"
                      >
                          <Icons.Reload className="h-4 w-4" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>重试</TooltipContent>
              </Tooltip> */}

				{/* <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleEditClick}
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-1  hover:bg-muted/60"
                            >
                                <Icons.Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>编辑</TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={handleCopyClick}
								size="icon"
								variant="ghost"
								className="h-6 w-6 p-1  hover:bg-muted/60"
							>
								{isCopied ? (
									<Icons.Check className="h-4 w-4 text-teal-200" />
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
	}
	const hasContext =
		(message.context || []).filter(
			(x) => x.type === ChatMessageContextType.SENCE
		).length > 0;

	const filesContexts = (message.context || []).filter(
		(x) => x.type !== ChatMessageContextType.SENCE
	);

	console.log('message.context:', message.context);

	return (
		<div className="flex flex-col group">
			<div
				className="relative  w-full flex flex-row justify-end px-2"
				key={message.id}
			>
				<div className="flex flex-col">
					<FileContextList files={filesContexts} />
					<div className="flex flex-col px-2 py-2 rounded-lg shadow-sm roundeded  bg-blue-500 text-white relative">
						{/* <div
                            className={classNames(
                                'flex flex-row flex-wrap w-full gap-1.5 text-micro  text-foreground-secondary mb-',
                                hasContext ? 'min-h-6' : 'h-0'
                            )}
                        >
                            <AnimatePresence mode="popLayout">
                                {(message.context || []).map(
                                    (context: ChatMessageContext, index: number) => {
                                        // if (context.type === ChatMessageContextType.SENCE) {
                                        //     return (
                                        //         <div className="text-small flex items-center bg-foreground-brand text-background-primary px-1 rounded-md">
                                        //             {context.senceName}
                                        //         </div>
                                        //     );
                                        // }
                                        return <></>;
                                    }
                                )}
                            </AnimatePresence>
                        </div> */}
						<div className="text-small mt-1">
							{isEditing ? renderEditingInput() : renderContent()}
						</div>
					</div>
				</div>
			</div>
			{!isEditing && renderButtons()}
		</div>
	);
};
