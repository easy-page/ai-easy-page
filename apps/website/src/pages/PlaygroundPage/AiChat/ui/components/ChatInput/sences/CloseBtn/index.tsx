import classNames from 'classnames';

export type CloseBtnProps = {
	icon: React.ReactNode;
	onClick: () => void;
	className?: string;
};
export const CloseBtn = ({ className, icon, onClick }: CloseBtnProps) => {
	return (
		<div
			onClick={onClick}
			className={classNames(
				'flex items-center gap-1 hover:bg-background-hover px-2  py-2 rounded-md text-smallPlus cursor-pointer',
				className
			)}
		>
			{icon && <span className="">{icon}</span>}
		</div>
	);
};
