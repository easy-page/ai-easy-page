import './index.less';
import { ChatMode } from '../../../common/constants/scence';
import { useService } from '@/infra';
import { useObservable } from '../../../hooks/useObservable';
import { ChatService } from '../../../services/chatGlobalState';
import { ChatInput } from '../../components/ChatInput';
/**
 * 就是没有消息的页面，没有会话 ID, 发送消息之后会进入会话 ID
 * @returns
 */
export type NewChatPanelProps = Record<string, never>;

// 获取基于当前时间的问候语
const getGreeting = () => {
	const hour = new Date().getHours();

	if (hour >= 5 && hour < 12) {
		return '早上好';
	} else if (hour >= 12 && hour < 18) {
		return '下午好';
	} else if (hour >= 18 && hour < 23) {
		return '晚上好';
	} else {
		return '深夜好';
	}
};

export const NewChatPanel = () => {
	const chatService = useService(ChatService);
	const userInfo = useObservable(chatService.globalState.userInfo$, null);
	return (
		<div className="flex h-[calc(100vh-200px)] flex-col relative overflow-auto items-center justify-center">
			<div className="flex-1 flex flex-col justify-center items-center mb-2">
				<div className="title-container mb-6">
					<div className="text-container relative pr-16 overflow-visible">
						<span className="text text-3xl ">
							{`${getGreeting()}，`}
							<span className="user-name-text z-[100] relative">
								{userInfo?.userName || '用户'}
							</span>
						</span>
					</div>
				</div>
			</div>

			<div className="w-full max-w-[800px] px-4 flex justify-center">
				<ChatInput chatMode={ChatMode.NewChat} />
			</div>
		</div>
	);
};
