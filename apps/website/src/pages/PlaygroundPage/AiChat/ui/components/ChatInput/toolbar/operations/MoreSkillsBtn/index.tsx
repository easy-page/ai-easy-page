import { useObservable } from '../../../../../../hooks/useObservable';
import { useService } from '../../../../../../infra';
import { MoreSkillsIcon } from '../../../../Icons';
import { useState, useEffect } from 'react';
import { Dropdown } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { ChatService } from '../../../../../../services/chatGlobalState';
import {
	SenceConfig,
	SenceCategoryEnum,
	SCENE_CATEGORIES,
} from '../../../../../../common/interfaces/senceConfig';
import { Icons } from '../../../../../baseUi/components/icons';

// 常量定义
const RECENTLY_USED_SKILLS_KEY = 'recentlyUsedSkills';
const MAX_RECENT_DISPLAY = 5; // 最多显示的最常用技能数量

// 使用次数统计接口
interface SkillUsageCount {
	[skillId: string]: number;
}

export type MoreSkillsBtnProps = {
	disabled?: boolean;
};

export const MoreSkillsBtn = ({ disabled }: MoreSkillsBtnProps) => {
	const chatService = useService(ChatService);
	const senceConfigs = useObservable(chatService.globalState.senceConfigs$, []);
	const isWaiting = useObservable(chatService.globalState.isWaiting$, false);
	const [loading, setLoading] = useState(false);
	const [recentlyUsed, setRecentlyUsed] = useState<SenceConfig[]>([]);
	const userInfo = useObservable(chatService.globalState.userInfo$, null);

	console.log('userInfo', userInfo);

	useEffect(() => {
		const init = async () => {
			setLoading(true);
			await chatService.getSenceConfigs(userInfo?.userMis || '');
			setLoading(false);
		};
		if (userInfo) {
			init();
		}
	}, [userInfo]);

	useEffect(() => {
		// 从本地存储获取使用次数统计
		const stored = localStorage.getItem(RECENTLY_USED_SKILLS_KEY);
		if (stored && senceConfigs.length > 0) {
			try {
				const usageCounts: SkillUsageCount = JSON.parse(stored);
				console.log('usageCountsusageCounts:', usageCounts);

				// 按使用次数排序，获取最常用的技能
				const sortedSkills = Object.entries(usageCounts)
					.sort(([, countA], [, countB]) => countB - countA) // 按次数降序排列
					.slice(0, MAX_RECENT_DISPLAY) // 取前5个
					.map(([senceId]) => senceId);

				// 根据senceId找到对应的配置
				const mostUsedSkills = sortedSkills
					.map((senceId) =>
						senceConfigs.find((config) => String(config.senceId) === senceId)
					)
					.filter(Boolean) as SenceConfig[];

				setRecentlyUsed(mostUsedSkills);
			} catch (error) {
				console.error('解析技能使用统计失败:', error);
			}
		}
	}, [senceConfigs]);

	const handleSelect = (key: string) => {
		const selectedConfig = senceConfigs.find(
			(config) => String(config.senceId) === key
		);
		if (selectedConfig) {
			chatService.globalState.setCurSenceConfig(selectedConfig);

			// 更新使用次数统计
			updateUsageCount(selectedConfig);
		}
	};

	const updateUsageCount = (config: SenceConfig) => {
		const senceId = String(config.senceId);
		let usageCounts: SkillUsageCount = {};

		try {
			const stored = localStorage.getItem(RECENTLY_USED_SKILLS_KEY);
			if (stored) {
				usageCounts = JSON.parse(stored);
			}
		} catch (error) {
			console.error('获取技能使用统计失败:', error);
		}

		// 增加使用次数
		usageCounts[senceId] = (usageCounts[senceId] || 0) + 1;

		localStorage.setItem(RECENTLY_USED_SKILLS_KEY, JSON.stringify(usageCounts));

		// 立即更新显示的最常用技能
		const sortedSkills = Object.entries(usageCounts)
			.sort(([, countA], [, countB]) => countB - countA)
			.slice(0, MAX_RECENT_DISPLAY)
			.map(([senceId]) => senceId);

		const mostUsedSkills = sortedSkills
			.map((senceId) =>
				senceConfigs.find((config) => String(config.senceId) === senceId)
			)
			.filter(Boolean) as SenceConfig[];

		setRecentlyUsed(mostUsedSkills);
	};

	// 根据分类分组场景配置
	const getConfigsByCategory = (categoryId: SenceCategoryEnum) => {
		return senceConfigs.filter((config) => config.senceCategory === categoryId);
	};

	// 获取分类标题
	const getCategoryTitle = (categoryId: SenceCategoryEnum) => {
		const category = SCENE_CATEGORIES.find((cat) => cat.id === categoryId);
		return category?.title || categoryId;
	};

	// 获取分类图标
	const getCategoryIcon = (categoryId: SenceCategoryEnum) => {
		const iconMap = {
			[SenceCategoryEnum.REGISTER]: Icons.RegisterIcon,
			[SenceCategoryEnum.CANCEL]: Icons.CancelIcon,
			[SenceCategoryEnum.MODIFY]: Icons.ModifyIcon,
			[SenceCategoryEnum.SUBSIDY]: Icons.SubsidyIcon,
			[SenceCategoryEnum.QUERY]: Icons.QueryIcon,
		};
		return iconMap[categoryId] || null;
	};

	const renderCategoryGroup = (categoryId: SenceCategoryEnum) => {
		const configs = getConfigsByCategory(categoryId);
		if (configs.length === 0) return null;

		const IconComponent = getCategoryIcon(categoryId);

		return (
			<div key={categoryId}>
				<Dropdown.Title>
					<div className="flex items-center gap-2">
						{IconComponent && <IconComponent className="text-gray-600" />}
						{getCategoryTitle(categoryId)}
					</div>
				</Dropdown.Title>
				{configs.map((config) => (
					<Dropdown.Item
						key={String(config.senceId)}
						onClick={() => handleSelect(String(config.senceId))}
					>
						{config.name}
					</Dropdown.Item>
				))}
			</div>
		);
	};

	const isDisabled = disabled || isWaiting;
	console.log('senceConfigs', senceConfigs);

	return (
		<Dropdown
			trigger="click"
			position="topLeft"
			clickToHide
			disabled={isDisabled}
			className="max-h-[300px] overflow-y-auto w-[200px]"
			render={
				!isDisabled ? (
					<Dropdown.Menu>
						{/* 最常使用 */}
						{recentlyUsed.length > 0 && (
							<>
								<Dropdown.Title>
									<div className="flex items-center gap-2">
										<Icons.ClockIcon className="text-gray-600" />
										最常使用
									</div>
								</Dropdown.Title>
								{recentlyUsed.map((config) => (
									<Dropdown.Item
										key={`recent-${String(config.senceId)}`}
										onClick={() => handleSelect(String(config.senceId))}
									>
										{config.name}
									</Dropdown.Item>
								))}
								<Dropdown.Divider />
							</>
						)}

						{/* 按分类显示 */}
						{Object.values(SenceCategoryEnum).map((categoryId, index) => (
							<div key={categoryId}>
								{renderCategoryGroup(categoryId)}
								{index < Object.values(SenceCategoryEnum).length - 1 &&
									getConfigsByCategory(categoryId).length > 0 && (
										<Dropdown.Divider />
									)}
							</div>
						))}
					</Dropdown.Menu>
				) : null
			}
		>
			<div
				onClick={(e) => {
					console.log('what 123213');
					if (isDisabled) {
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}}
				className={classNames(
					'rounded-[10px] hover:bg-background-secondary p-2 border border-md border-[#EBEBEB]',
					{
						'opacity-50 cursor-not-allowed': isDisabled,
						'cursor-pointer': !isDisabled,
					}
				)}
			>
				<div className="flex flex-row items-center px-2">
					<MoreSkillsIcon />
					<div className="ml-2 text-small">技能</div>
				</div>
			</div>
		</Dropdown>
	);
};
