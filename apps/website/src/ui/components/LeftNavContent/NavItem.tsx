import classNames from 'classnames';
import { NavItemInfo } from './constants';

export type NavItemProps = NavItemInfo & {
	selected?: boolean;
};

const navItemStyles = {
	base: 'flex flex-row items-center justify-between w-full p-2 rounded-md transition-colors duration-200',
	state: {
		default: `
			bg-background-secondary
			hover:bg-background-hover
			active:bg-background-active
			text-foreground-primary
		`,
		highlighted: `
			bg-background-brand/10
			hover:bg-background-brand/20
			active:bg-background-brand/30
			text-foreground-brand
		`,
		selected: `
			bg-background
			text-foreground-active
		`,
	},
	icon: 'mr-2',
};

export const NavItem = ({
	icon,
	label,
	isHighlighted,
	selected,
	onClick,
	className,
	rightIcon,
}: NavItemProps) => {
	return (
		<button
			className={classNames(className, navItemStyles.base, {
				[navItemStyles.state.highlighted]: isHighlighted,
				[navItemStyles.state.default]: !selected && !isHighlighted,
				[navItemStyles.state.selected]: !isHighlighted && selected,
			})}
			onClick={onClick}
		>
			<div className="flex flex-row items-center">
				<span className={navItemStyles.icon}>{icon}</span>
				<span
					className={classNames('text-smallPlus', {
						'font-medium': isHighlighted,
					})}
				>
					{label}
				</span>
			</div>
			{rightIcon && <span className={navItemStyles.icon}>{rightIcon}</span>}
		</button>
	);
};
