import { useObservable } from '../../../../../../hooks/useObservable';
import { useService } from '../../../../../../infra';
import { ChatService } from '../../../../../../services/chatGlobalState';
import { Editor, Node } from 'slate';
import { IconButton, SendIcon, StopIcon } from '../../../../Icons';
import classNames from 'classnames';
import { ReactEditor } from 'slate-react';
import { useNavigate } from 'react-router-dom';
import { ChatMode } from '../../../../../../common/constants/scence';
import { useMemo } from 'react';
export type SendBtnProps = {
	disabledSend: boolean;
	chatMode: ChatMode;
	editor: ReactEditor;
	onSend: () => void;
};
export const SendBtn = ({ disabledSend, onSend, editor }: SendBtnProps) => {
	const chatService = useService(ChatService);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);
	const isEmpty = useObservable(chatService.globalState.isEmptyInput$, true);
	// const isEmpty = useMemo(() => {
	//     return !Boolean(Node.string(editor));
	// }, [editor.children]);
	console.log('1231231:', isEmpty);
	return (
		<IconButton
			className={classNames('text-[#222222] text-[28px]', {
				'cursor-not-allowed text-foreground-disabled':
					(!isWaiting && disabledSend) || isEmpty,
				'hover:text-[#444444]': !isEmpty && !disabledSend,
			})}
			disableBorder
			disabledTips={'请输入内容'}
			tooltip={isWaiting ? '停止响应' : '发送消息'}
			disabled={isEmpty}
			disableHover
			onClick={() => {
				if (!isWaiting && !isEmpty) {
					onSend();
				} else {
					chatService.stopStream();
				}
			}}
			icon={isWaiting ? <StopIcon /> : <SendIcon />}
		/>
	);
};
