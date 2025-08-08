import { NavItemEnum } from '../../../services/chatGlobalState/constant';
import {
	CommandK,
	More,
	PlusIcon,
	EditIcon,
	SearchIcon,
	PenIcon,
	// SearchIcon,
	// CodeIcon,
	// ImageIcon,
	// MoreIcon,
} from '../Icons';
import { NavItemBaseInfo } from '../../../services/chatGlobalState/interface';

export type NavItemInfoContext = {
	setCurNavItem: (curNavItem: NavItemEnum) => void;
};
export type NavItemInfo = NavItemBaseInfo & {
	onClick?: () => void;
};

export const CoreNavItems: Omit<NavItemInfo, 'onClick'>[] = [
	{
		id: NavItemEnum.NewChat,
		icon: <PlusIcon />,
		label: '新对话',
		// isHighlighted: true,
		className: 'mb-2 bg-white',
		// rightIcon: <CommandK />,
	},
];
