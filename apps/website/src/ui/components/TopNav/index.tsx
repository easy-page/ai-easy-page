import classNames from 'classnames';
import { Button, Input, Modal, Tooltip } from '@douyinfe/semi-ui';
import { useObservable } from '../../../hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '../../../services/chatGlobalState';
import { NavItemEnum } from '../../../services/chatGlobalState/constant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftNavContentProps } from '../LeftNavContent';
import { ExpandButton } from '../ExpandButton';
import { EditIcon } from '../Icons';
import { TopNavRightButtons } from '../TopNavRightButtons';

export type TopNavProps = Pick<
	LeftNavContentProps,
	'onHistoryItemClick' | 'onNavItemChange'
> & {
	className?: string;
};

export const TopNav = ({
	className,
	onHistoryItemClick,
	onNavItemChange,
}: TopNavProps) => {
	const chatService = useService(ChatService);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const curConversation = useObservable(
		chatService.globalState.curConversation$,
		null
	);
	const curNavItem = useObservable(
		chatService.globalState.curNavItem$,
		NavItemEnum.NewChat
	);
	const isLeftNavOpen = useObservable(
		chatService.globalState.isLeftNavOpen$,
		false
	);
	const [cvName, setCvName] = useState(
		curConversation?.displayName || '未命名对话'
	);
	const navigate = useNavigate();

	useEffect(() => {
		setCvName(curConversation?.displayName || '未命名对话');
	}, [curConversation]);

	const handleNewChat = () => {
		chatService.globalState.setCurrentCardId(null);
		chatService.globalState.setCurConversation(null);
		chatService.globalState.setIsRightPanelOpen(false);
		chatService.globalState.setIsLeftNavOpen(true);
		chatService.globalState.setCurNavItem(NavItemEnum.NewChat);
	};

	const handleEditClick = () => {
		// setEditName(conversationName);
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		// 这里需要调用服务来更新对话名称
		await chatService.updateConversationName(
			curConversation?.conversationId || '',
			cvName
		);
		setIsModalVisible(false);
	};
	const conversationName = curConversation?.displayName || '未命名对话';
	console.log('12321231ahahahah232112:', curConversation, conversationName);

	return (
		<div
			className={classNames(
				'flex h-14 w-full items-center justify-between px-4',
				className
			)}
		>
			<div className="flex items-center gap-4">
				<>
					<ExpandButton
						onHistoryItemClick={onHistoryItemClick}
						onNavItemChange={onNavItemChange}
						showHoverPanel={true}
					/>
					<Tooltip content={'新会话'} position="right">
						<div
							onClick={() => {
								handleNewChat();
								onNavItemChange(NavItemEnum.NewChat, { navigate: navigate });
							}}
							className=" relative p-2 text-title3 hover:bg-background-hover rounded-md cursor-pointer"
						>
							<img
								src={`https://s3plus.meituan.net/zspt-fe/jarvis/add_chat.png?t=${Date.now()}`}
								alt="new-chat"
								className="w-5 h-5"
							/>
						</div>
					</Tooltip>
					<div className="h-6 w-[1px] bg-border"></div>
				</>
				<div className="text-regularPlus font-medium text-foreground-primary">
					<Button
						theme="borderless"
						type="secondary"
						onClick={handleEditClick}
						className="group flex text-foreground-primary items-center gap-1 px-2 hover:bg-background-hover"
					>
						<span className="mr-2">{conversationName}</span>
						<div className="hidden group-hover:block">
							<EditIcon />
						</div>
					</Button>
				</div>
			</div>
			{/* <TopNavRightButtons /> */}
			<Modal
				title="修改对话名称"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}
				maskClosable={false}
			>
				<div className="">
					<Input
						defaultValue={cvName}
						onChange={(value) => {
							setCvName(value);
						}}
						placeholder="请输入新的对话名称"
						showClear
					/>
				</div>
			</Modal>
		</div>
	);
};
