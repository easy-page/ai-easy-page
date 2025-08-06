import React, { FC, useState, useEffect, useMemo } from 'react';
import {
	Modal,
	Tabs,
	Input,
	Space,
	Card,
	Button,
	Tag,
	Tooltip,
	Empty,
} from 'antd';
import {
	SearchOutlined,
	StarOutlined,
	StarFilled,
	FireOutlined,
} from '@ant-design/icons';
import { ComponentType } from '../../../../../constant/componentTypes';
import {
	ComponentCategory,
	COMPONENT_CATEGORIES,
} from '../types/componentCategories';
import {
	ComponentTypeOption,
	searchComponentOptions,
} from '../data/componentOptions';
import { getComponentConfig } from '../ComponentConfig';
import CategoryPanel from './CategoryPanel';
import SearchPanel from './SearchPanel';
import FavoritePanel from './FavoritePanel';
import RecentPanel from './RecentPanel';
import ComponentConfigPanel from './ComponentConfigPanel';
import ComponentPreview from './ComponentPreview';
import { TAB_KEYS, STORAGE_KEYS, DEFAULTS, TabKey } from './constants';
import './index.less';

const { TabPane } = Tabs;

interface AddComponentModalProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (componentType: ComponentType, isFormComponent: boolean) => void;
	defaultIsFormComponent?: boolean;
}

const AddComponentModal: FC<AddComponentModalProps> = ({
	visible,
	onCancel,
	onOk,
	defaultIsFormComponent = DEFAULTS.DEFAULT_IS_FORM_COMPONENT,
}) => {
	const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.CATEGORIES);
	const [activeCategory, setActiveCategory] = useState<ComponentCategory>(
		ComponentCategory.FORM_INPUT
	);

	// 处理Tab切换，确保类型安全
	const handleTabChange = (activeKey: string) => {
		setActiveTab(activeKey as TabKey);
	};

	// 处理分类Tab切换
	const handleCategoryChange = (activeKey: string) => {
		setActiveCategory(activeKey as ComponentCategory);
	};
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedComponent, setSelectedComponent] =
		useState<ComponentTypeOption | null>(null);
	const [isFormComponent, setIsFormComponent] = useState(
		defaultIsFormComponent
	);
	const [favorites, setFavorites] = useState<ComponentType[]>([]);
	const [recentUsed, setRecentUsed] = useState<ComponentType[]>([]);

	// 从localStorage加载收藏和最近使用
	useEffect(() => {
		const savedFavorites = localStorage.getItem(
			STORAGE_KEYS.COMPONENT_FAVORITES
		);
		const savedRecent = localStorage.getItem(STORAGE_KEYS.COMPONENT_RECENT);

		if (savedFavorites) {
			setFavorites(JSON.parse(savedFavorites));
		}
		if (savedRecent) {
			setRecentUsed(JSON.parse(savedRecent));
		}
	}, []);

	// 保存收藏和最近使用到localStorage
	useEffect(() => {
		localStorage.setItem(
			STORAGE_KEYS.COMPONENT_FAVORITES,
			JSON.stringify(favorites)
		);
	}, [favorites]);

	useEffect(() => {
		localStorage.setItem(
			STORAGE_KEYS.COMPONENT_RECENT,
			JSON.stringify(recentUsed)
		);
	}, [recentUsed]);

	// 处理组件选择
	const handleComponentSelect = (component: ComponentTypeOption) => {
		setSelectedComponent(component);
		const config = getComponentConfig(component.value);

		// 如果组件不能使用FormItem，强制设置为false
		if (!config.canUseFormItem) {
			setIsFormComponent(false);
		} else {
			setIsFormComponent(defaultIsFormComponent);
		}
	};

	// 处理确定
	const handleOk = () => {
		if (selectedComponent) {
			// 添加到最近使用
			const newRecent = [
				selectedComponent.value,
				...recentUsed.filter((type) => type !== selectedComponent.value),
			].slice(0, DEFAULTS.MAX_RECENT_COMPONENTS);
			setRecentUsed(newRecent);

			onOk(selectedComponent.value, isFormComponent);
			handleCancel();
		}
	};

	// 处理取消
	const handleCancel = () => {
		setSelectedComponent(null);
		setSearchKeyword('');
		setIsFormComponent(defaultIsFormComponent);
		setActiveTab(TAB_KEYS.CATEGORIES);
		setActiveCategory(ComponentCategory.FORM_INPUT);
		onCancel();
	};

	// 切换收藏状态
	const toggleFavorite = (componentType: ComponentType) => {
		setFavorites((prev) =>
			prev.includes(componentType)
				? prev.filter((type) => type !== componentType)
				: [...prev, componentType]
		);
	};

	return (
		<Modal
			title={
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<span>添加组件</span>
					{selectedComponent && (
						<Tag color="blue" style={{ margin: 0 }}>
							{selectedComponent.label}
						</Tag>
					)}
				</div>
			}
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText="确定"
			cancelText="取消"
			okButtonProps={{ disabled: !selectedComponent }}
			width={1200}
			className="add-component-modal"
		>
			<div className="modal-content">
				{/* 搜索栏 */}
				<div className="search-bar">
					<Input
						placeholder="搜索组件..."
						prefix={<SearchOutlined />}
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
						onPressEnter={() => setActiveTab(TAB_KEYS.SEARCH)}
						allowClear
					/>
				</div>

				{/* 左右布局 */}
				<div className="modal-layout">
					{/* 左侧：组件选择 */}
					<div className="left-panel">
						{/* 标签页 */}
						<Tabs
							activeKey={activeTab}
							onChange={handleTabChange}
							className="component-tabs"
						>
							<TabPane tab="分类浏览" key={TAB_KEYS.CATEGORIES}>
								<Tabs
									activeKey={activeCategory}
									onChange={handleCategoryChange}
									className="category-tabs"
								>
									{COMPONENT_CATEGORIES.map((category) => (
										<TabPane
											tab={
												<span>
													<span style={{ marginRight: 4 }}>
														{category.icon}
													</span>
													{category.name}
												</span>
											}
											key={category.id}
										>
											<CategoryPanel
												category={category.id}
												onComponentSelect={handleComponentSelect}
												selectedComponent={selectedComponent}
												favorites={favorites}
												onToggleFavorite={toggleFavorite}
											/>
										</TabPane>
									))}
								</Tabs>
							</TabPane>
							<TabPane tab="搜索" key={TAB_KEYS.SEARCH}>
								<SearchPanel
									keyword={searchKeyword}
									onComponentSelect={handleComponentSelect}
									selectedComponent={selectedComponent}
									favorites={favorites}
									onToggleFavorite={toggleFavorite}
								/>
							</TabPane>
							<TabPane tab="收藏" key={TAB_KEYS.FAVORITES}>
								<FavoritePanel
									favorites={favorites}
									onComponentSelect={handleComponentSelect}
									selectedComponent={selectedComponent}
									onToggleFavorite={toggleFavorite}
								/>
							</TabPane>
							<TabPane tab="最近使用" key={TAB_KEYS.RECENT}>
								<RecentPanel
									recentUsed={recentUsed}
									onComponentSelect={handleComponentSelect}
									selectedComponent={selectedComponent}
									favorites={favorites}
									onToggleFavorite={toggleFavorite}
								/>
							</TabPane>
						</Tabs>
					</div>

					{/* 右侧：预览和配置 */}
					<div className="right-panel">
						{/* 组件预览 */}
						<ComponentPreview selectedComponent={selectedComponent} />

						{/* 组件配置 */}
						{selectedComponent && (
							<div className="component-config">
								<ComponentConfigPanel
									component={selectedComponent}
									isFormComponent={isFormComponent}
									onFormComponentChange={setIsFormComponent}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default AddComponentModal;
