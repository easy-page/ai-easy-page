import { useObservable } from '../../../hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '../../../services/chatGlobalState';
import { useAuth } from '../../../hooks/useAuth';
import {
	BellIcon,
	DotIcon,
	IconButton,
	ShareIcon,
	TemplateCloseIcon,
	UserIcon,
} from '../Icons';
import { useState, useRef, useEffect } from 'react';
import { Dropdown } from '@douyinfe/semi-ui';
import { FullTaskInfo } from '../../../common/interfaces/task';
import { getQueryString } from '../../../common/utils/url';
import { isInIframe } from '../../../common/utils/env';

const RedDot = () => {
	return (
		<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
	);
};

export const TopNavRightButtons = () => {
	const chatService = useService(ChatService);
	const { user } = useAuth();
	const isRightPanelOpen = useObservable(
		chatService.globalState.isRightPanelOpen$,
		false
	);
	const chatId = getQueryString('chatId');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const avatarRef = useRef<HTMLButtonElement>(null);

	const dropdownItems = [
		{ key: 'share', name: '分享该对话' },
		{ key: 'collect', name: '收藏' },
	];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				avatarRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				!avatarRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	if (isRightPanelOpen) {
		return (
			<div className="flex items-center">
				<Dropdown
					trigger="click"
					position="bottomRight"
					render={
						<Dropdown.Menu>
							{dropdownItems.map((item) => (
								<Dropdown.Item
									key={item.key}
									className="text-foreground-primary"
								>
									{item.name}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					}
				>
					<button className="p-2 rounded-lg hover:bg-background-hover">
						<DotIcon />
					</button>
				</Dropdown>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			{/* <button className="p-2 rounded-lg hover:bg-background-hover">
				<ShareIcon />
			</button>

			<button className="p-2 rounded-lg hover:bg-background-hover relative">
				<BellIcon />
				<RedDot />
			</button> */}

			<div className="relative">
				<div className="flex flex-row items-center">
					<button
						ref={avatarRef}
						className="w-8 h-8 rounded-full bg-background-primary flex items-center justify-center hover:bg-background-hover transition-colors"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<UserIcon className="w-5 h-5 text-foreground-secondary" />
					</button>
				</div>

				{isMenuOpen && (
					<div
						ref={menuRef}
						className="absolute right-0 top-full mt-2 w-64 bg-background-primary rounded-lg shadow-lg overflow-hidden z-50 animate-menu-appear border border-border"
					>
						{/* 菜单内容 */}
						<div className="p-4 text-foreground-primary">
							<div className="flex flex-row items-center ">
								<UserIcon className="w-5 h-5 mr-4 text-foreground-secondary" />
								<div className="flex flex-col">
									<div className="text-foreground-primary text-regularPlus">
										{user?.mis || '用户'}
									</div>
									<div className="text-foreground-secondary text-smallPlus">
										{user?.email || ''}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
