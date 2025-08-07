import { ChatService } from '../../../services/chatGlobalState';
import './index.less';
import { useObservable } from '../../../hooks/useObservable';
import { useService } from '../../../infra';
import { AssistantMessage } from '../AssistantMessage';

export const StreamingMessage = () => {
	const chatService = useService(ChatService);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);
	const currentStreamMsg = useObservable(
		chatService.globalState.currentStreamMsg$,
		null
	);
	console.log(
		'currentSt123reamMsg:',
		isWaiting,
		JSON.stringify(currentStreamMsg?.cards)
	);
	return (
		<>{currentStreamMsg && <AssistantMessage message={currentStreamMsg} />}</>
	);
};
