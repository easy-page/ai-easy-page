import { useObservable } from '../../../hooks/useObservable';
import { useService } from '../../../infra';
import { ChatService } from '../../../services/chatGlobalState';
import { Tooltip } from '@douyinfe/semi-ui';
import { useMemo, useState } from 'react';
import { LeftNavContent, LeftNavContentProps } from '../LeftNavContent';
import classNames from 'classnames';
import { ExpandNav } from '../Icons';

export type ExpandButtonProps = Pick<
	LeftNavContentProps,
	'onHistoryItemClick' | 'onNavItemChange'
> & {
	showHoverPanel?: boolean;
};

const SlidePanel = ({
	onHistoryItemClick,
	onNavItemChange,
}: Pick<LeftNavContentProps, 'onHistoryItemClick' | 'onNavItemChange'>) => (
	<div
		className={classNames(
			'flex flex-col absolute right-[calc(100%+4px)] max-h-[400px] bg-background-secondary top-full mt-1 w-64 shadow-lg transform transition-all duration-300 ease-in-out overflow-hidden rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-full'
		)}
		style={{
			zIndex: 1000,
		}}
		onClick={(e) => {
			e.stopPropagation();
			e.preventDefault();
		}}
	>
		<LeftNavContent
			onNavItemChange={onNavItemChange}
			onHistoryItemClick={onHistoryItemClick}
		/>
	</div>
);

export const ExpandButton = ({
	showHoverPanel = false,
	onHistoryItemClick,
	onNavItemChange,
}: ExpandButtonProps) => {
	const chatService = useService(ChatService);
	const isLeftNavOpen = useObservable(
		chatService.globalState.isLeftNavOpen$,
		false
	);

	const isRightPanelOpen = useObservable(
		chatService.globalState.isRightPanelOpen$,
		false
	);

	const ExpandButtonComponent = useMemo(() => {
		return (
			<div
				className="group relative p-2 text-title3 hover:bg-background-hover rounded-md cursor-pointer"
				onClick={() => {
					chatService.globalState.setIsLeftNavOpen(!isLeftNavOpen);
				}}
			>
				<ExpandNav />
				{showHoverPanel && !isRightPanelOpen && (
					<SlidePanel
						onHistoryItemClick={onHistoryItemClick}
						onNavItemChange={onNavItemChange}
					/>
				)}
			</div>
		);
	}, [isLeftNavOpen, isRightPanelOpen]);

	if (showHoverPanel) {
		return ExpandButtonComponent;
	}
	return (
		<Tooltip content={isLeftNavOpen ? '收起' : '展开'} position="right">
			{ExpandButtonComponent}
		</Tooltip>
	);
};
