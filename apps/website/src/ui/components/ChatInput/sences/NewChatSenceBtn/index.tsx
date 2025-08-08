import { useEffect } from 'react';
import { Tooltip } from '@douyinfe/semi-ui';
import { SenceConfig } from '../../../../../common/interfaces/senceConfig';

export type NewChatSenceBtnProps = {
	curSenceConfig: SenceConfig;
	clearSenceConfig: () => void;
};
export const NewChatSenceBtn = ({
	curSenceConfig,
	clearSenceConfig,
}: NewChatSenceBtnProps) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && curSenceConfig) {
				// 清空场景
				clearSenceConfig();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		// 清理函数
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [curSenceConfig, clearSenceConfig]);
	if (!curSenceConfig) {
		return null;
	}
	return (
		<div
			className="cursor-pointer w-fit mr-2"
			onClick={() => {
				// 清空场景
				clearSenceConfig();
			}}
		>
			<Tooltip
				content="点击退出技能 ESC"
				position="top"
				showArrow
				arrowPointAtCenter
			>
				<div className="flex font-bold items-center bg-background-brand-tertiary text-foreground-brand rounded-md px-3 py-1">
					<span className="mr-1">←</span>
					<span className="text-smallPlus">{curSenceConfig.name}</span>
				</div>
			</Tooltip>
		</div>
	);
};
