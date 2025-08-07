import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { RouterNames } from '@/routers/constant';
import { ChatService } from '@/services/chatGlobalState';
import { NavItemEnum } from '@/services/chatGlobalState/constant';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { CoreNavItems } from './constants';
import { NavItem } from './NavItem';
import { HistoryList, HistoryListProps } from './HistoryList';

export type LeftNavContentProps = Pick<
	HistoryListProps,
	'onHistoryItemClick'
> & {
	onNavItemChange: (
		navItem: string,
		options: {
			navigate: NavigateFunction;
		}
	) => void;
};
export const LeftNavContent = ({
	onNavItemChange,
	onHistoryItemClick,
}: LeftNavContentProps) => {
	const chatService = useService(ChatService);
	const curNavItem = useObservable(
		chatService.globalState.curNavItem$,
		NavItemEnum.NewChat
	);
	const navigate = useNavigate();
	console.log('curNavItemcurNavItem:', curNavItem);
	const customNavItems = useObservable(
		chatService.globalState.customNavItems$,
		[]
	);
	console.log('customNavItemscustomNavItems:', customNavItems);
	return (
		<>
			<div className="p-4 ">
				{[...CoreNavItems, ...customNavItems].map((item) => (
					<NavItem
						key={item.id}
						onClick={() => {
							console.log('item.iditem.id:', item.id);
							chatService.globalState.setCurNavItem(item.id);
							if (item.id === NavItemEnum.NewChat) {
								// navigate(RouterNames.Chat);

								chatService.globalState.setCurrentCardId(null);
								chatService.globalState.setIsRightPanelOpen(false);
								chatService.globalState.setCurConversation(null);
							}
							// switch (item.id) {
							//     case NavItemEnum.AiRead:
							//         navigate(RouterNames.AiRead);
							//         break;
							//     case NavItemEnum.AiSearch:
							//         navigate(RouterNames.AiSearch);
							//         break;
							// }
							onNavItemChange?.(item.id, {
								navigate,
							});
						}}
						{...item}
						selected={curNavItem === item.id}
					/>
				))}
			</div>
			<div className="h-[1px] bg-border my-2" />
			<HistoryList onHistoryItemClick={onHistoryItemClick} />
		</>
	);
};
