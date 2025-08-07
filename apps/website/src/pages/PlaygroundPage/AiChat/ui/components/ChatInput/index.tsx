import { useEffect, useMemo, useState } from 'react';
import { Node } from 'slate';
import { ChatInputToolbar } from './toolbar';
import {
	ChatMode,
	SenceInputComponentOperationEnum,
	SenceOperationEnum,
	SenceTemplateComponentEnum,
} from '../../../common/constants/scence';
import { useService } from '../../../infra';
import { ChatService } from '../../../services/chatGlobalState';
import { NewChatSenceBtn } from './sences/NewChatSenceBtn';
import { isEmptyContent, SlateEditor } from '../SlateEditor';
import { createEditor, Descendant } from 'slate';
import { PARAGRAPH_ELEMENT, SENCE_ELEMENT } from '../SlateEditor/components';
import { useObservable } from '../../../hooks/useObservable';
import { TopSencePanel } from './sences/TopSencePanel';
import { InputToolsEnum } from '../../../common/constants/inputTools';
import { INPUT_ELEMENT } from '../SlateEditor/components/InputElement';
import { UPLOAD_FILE_ELEMENT } from '../SlateEditor/components/UploadElement';
import { withReact } from 'slate-react';
import { withCustomNodes } from '../SlateEditor/plugins/withCustomNodes';
import { useNavigate } from 'react-router-dom';
import { generateLocalId, getChatUrl } from '../../../routers/toChat';
import { NavItemEnum } from '../../../services/chatGlobalState/constant';
import { RouterNames } from '../../../routers/constant';
import { InputToolsConfig } from '../../../common/interfaces/senceConfig/senceInput';
import { Contexts } from './contexts';
import { ReactEditor } from 'slate-react';

export type ChatInputProps = {
	chatMode: ChatMode;
	extraTools?: InputToolsConfig;
};

export const ChatInput = ({ chatMode, extraTools }: ChatInputProps) => {
	const [messages, setMessages] = useState<string[]>(['a', 'b']);
	const isNew = chatMode === ChatMode.NewChat;
	const chatService = useService(ChatService);
	const curConversation = useObservable(
		chatService.globalState.curConversation$,
		null
	);
	const curSenceConfig = useObservable(
		chatService.globalState.curSenceConfig$,
		null
	);
	const isReadOnly = useObservable(chatService.globalState.isReadOnly$, false);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);

	console.log('curSenceConfig:', curSenceConfig);
	const navigate = useNavigate();
	const editor = useMemo(() => {
		// 组合编辑器插件
		const curEditor = withCustomNodes(withReact(createEditor() as any));

		return curEditor;
	}, []);

	function sendMessage(text: string) {
		if (!text) {
			console.warn('Empty message');
			return;
		}
		const chatId = curConversation?.conversationId || generateLocalId();
		const toConversation = (cvId: string) => {
			const url = getChatUrl({ chatId: cvId });
			if (url.startsWith('/')) {
				navigate(url.replace(RouterNames.Chat, ''));
			} else {
				navigate(`${url}`);
			}
		};

		if (chatMode === ChatMode.NewChat) {
			toConversation(chatId);
			chatService.globalState.setCurNavItem(NavItemEnum.Conversation);
		}
		console.log('sendMessage:', text, chatId);
		chatService.sendNewMessage(text, {
			conversationIdInUrl: chatId,
			venueId: curVenue?.id || -1,
			updateConversationId: (conversationId: string) => {
				toConversation(conversationId);
			},
		});
	}

	const [timestamp, setTimestamp] = useState(new Date().getTime());

	const {
		initialValueWithSence,
		placeholder,
	}: {
		initialValueWithSence: Descendant[];
		placeholder?: string;
	} = useMemo(() => {
		const defaultInput: Descendant[] = [
			{
				type: PARAGRAPH_ELEMENT,
				children: [
					{
						text: '',
					},
				],
			},
		];
		const senceInput = curSenceConfig?.senceInput;
		if (senceInput && isNew) {
			return {
				placeholder: senceInput.placeholder,
				initialValueWithSence:
					senceInput.defaultInputsForNewChat ||
					senceInput.defaultInputs ||
					defaultInput,
			};
		}
		return {
			placeholder: senceInput?.placeholder || '请输入',
			initialValueWithSence: senceInput?.defaultInputs || defaultInput,
		};
	}, [curSenceConfig, isNew]);

	useEffect(() => {
		if (editor) {
			try {
				ReactEditor.focus(editor);
			} catch (error) {
				console.error('focus error:', error);
			}
		}
	}, [initialValueWithSence]);
	useEffect(() => {
		setTimestamp(Date.now());
		console.log('initialValueWithSence111:', 123);
		chatService.globalState.setIsEmptyInput(
			isEmptyContent(initialValueWithSence)
		);
	}, [curSenceConfig, isNew]);
	console.log('initialValueWithSence:', timestamp, initialValueWithSence);

	if (isReadOnly) {
		return <></>;
	}

	return (
		<div className="w-full flex flex-col border border-border rounded-2xl bg-white">
			{isNew ? (
				<></>
			) : (
				<TopSencePanel
					chatService={chatService}
					curSenceConfig={curSenceConfig}
				/>
			)}
			<div className="flex flex-col  px-4  pb-2 w-full  min-h-[120px]">
				<Contexts />
				<div
					className="max-h-[250px] overflow-auto flex-1 "
					onClick={() => {
						try {
							ReactEditor.focus(editor);
						} catch (error) {
							console.error('focus error:', error);
						}
					}}
				>
					<SlateEditor
						key={timestamp}
						editor={editor}
						chatService={chatService}
						placeholder={placeholder}
						initValue={initialValueWithSence}
						onSend={(editor) => {
							if (!isWaiting) {
								const text = Node.string(editor);
								console.log('full text:', text);
								sendMessage(text);
								if (!curSenceConfig) {
									setTimestamp(Date.now());
								}
								// setTimestamp(Date.now());
							}
						}}
					/>
				</div>
				<ChatInputToolbar
					editor={editor}
					extraTools={extraTools}
					onSend={() => {
						if (!isWaiting) {
							const text = Node.string(editor);
							console.log('full text:', text);
							sendMessage(text);
							if (!curSenceConfig) {
								setTimestamp(Date.now());
							}
							// setTimestamp(Date.now());
						}
					}}
					curSenceConfig={curSenceConfig}
					chatMode={chatMode}
				/>
			</div>
		</div>
	);
};
