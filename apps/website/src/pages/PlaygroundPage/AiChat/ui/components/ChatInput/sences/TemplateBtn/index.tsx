import classNames from 'classnames';

export type TemplateBtnProps = {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	className?: string;
	active: boolean;
};
export const TemplateBtn = ({
	className,
	icon,
	label,
	onClick,
	active,
}: TemplateBtnProps) => {
	return (
		<div
			onClick={onClick}
			className={classNames(
				'flex items-center gap-1  px-3 py-1 rounded-md text-smallPlus cursor-pointer',
				className,
				{
					'hover:bg-background-hover': !active,
					'bg-background-active': active,
				}
			)}
		>
			{icon && <span className="mr-1">{icon}</span>}
			{label}
		</div>
	);
};
