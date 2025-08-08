import { ConversationInfo } from '../../../common/interfaces/conversation';
import { getQueryString } from '../../../common/utils/url';
import { Dropdown } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { DotIcon } from '../Icons';

export enum HistoryItemOp {
	DELETE = 'delete',
	EDIT = 'edit',
}
export type HistoryItemProps = {
	item: ConversationInfo;
	onMenuClick: (chatId: string, op: HistoryItemOp) => void;
	onClick: () => void;
};

const historyStyles = {
	item: {
		base: 'px-4 py-2 rounded-xl hover:bg-background-hover cursor-pointer group',
		content: 'flex items-center justify-between',
		title: 'text-sm text-foreground-primary truncate',
		icon: 'w-4 h-4 text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200',
	},
};

export const HistoryItem = ({
	item,
	onMenuClick,
	onClick,
}: HistoryItemProps) => {
	const dropdownItems = [{ key: HistoryItemOp.DELETE, name: '删除' }];
	const chatId = getQueryString('chatId');
	const selected = chatId === `${item.conversationId}`;
	return (
		<div
			className={classNames('px-4 py-2 rounded-md  cursor-pointer group', {
				'bg-background text-foreground-active': selected,
				'hover:bg-background-hover': !selected,
			})}
			onClick={onClick}
		>
			<div className={historyStyles.item.content}>
				<span className={historyStyles.item.title}>{item.displayName}</span>
				<Dropdown
					trigger="click"
					position="bottomRight"
					render={
						<Dropdown.Menu>
							{dropdownItems.map((op) => (
								<Dropdown.Item
									key={op.key}
									className="text-foreground-primary"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onMenuClick?.(item.conversationId, op.key);
									}}
								>
									{op.name}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					}
				>
					<button className="px-2 rounded-lg">
						<DotIcon />
					</button>
				</Dropdown>
			</div>
		</div>
	);
};
