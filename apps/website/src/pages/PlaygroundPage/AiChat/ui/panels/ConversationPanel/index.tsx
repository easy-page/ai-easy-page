import { ChatMode } from '../../../common/constants/scence';
import { MessageList } from './MessageList';
import { InputToolsEnum } from '../../../common/constants/inputTools';
import { ChatInput } from '../../components/ChatInput';

export type ConversationPanelProps = {};
export const ConversationPanel = ({}: ConversationPanelProps) => {
	console.log('1231212312312312');
	return (
		<div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
			<MessageList />
			<div className="flex flex-col w-full">
				{/* <ChatSences chatMode={ChatMode.Conversation} /> */}
				<ChatInput
					chatMode={ChatMode.Conversation}
					extraTools={{
						left: [
							{
								tool: InputToolsEnum.MoreSkills,
								disabled: false,
							},
						],
						right: [],
					}}
				/>
			</div>
		</div>
	);
};
