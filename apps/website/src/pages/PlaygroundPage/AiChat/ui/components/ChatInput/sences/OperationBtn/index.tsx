import classNames from 'classnames';

export type OperationBtnProps = {
	icon: React.ReactNode;
	label: string;
	disabled?: boolean;
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};
export const OperationBtn = ({
	icon,
	label,
	onClick,
	disabled,
}: OperationBtnProps) => {
	return (
		<div
			onClick={(e) => {
				if (disabled) {
					return;
				}
				onClick(e);
			}}
			className={classNames(
				'flex items-center gap-1 px-3 py-1 border border-high-contrast rounded-md text-smallPlus transition-all duration-200 shadow-sm',
				{
					'opacity-50 cursor-not-allowed border-border-hover': disabled,
					'hover:bg-background-hover hover:border-button-hover hover:shadow-md active:border-button-active cursor-pointer':
						!disabled,
				}
			)}
		>
			{icon && <span className="mr-1">{icon}</span>}
			{label}
		</div>
	);
};
