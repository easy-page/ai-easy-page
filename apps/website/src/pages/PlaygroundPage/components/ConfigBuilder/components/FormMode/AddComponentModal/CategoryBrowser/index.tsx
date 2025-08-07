import React, { FC, useMemo } from 'react';
import { Menu, Card, Button, Tag, Tooltip, Empty } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { ComponentType } from '../../../../../../constant/componentTypes';
import {
	ComponentCategory,
	COMPONENT_CATEGORIES,
} from '../../types/componentCategories';
import {
	ComponentTypeOption,
	getComponentOptionsByCategory,
} from '../../data/componentOptions';
import './index.less';

interface CategoryBrowserProps {
	activeCategory: ComponentCategory;
	onCategoryChange: (category: ComponentCategory) => void;
	onComponentSelect: (component: ComponentTypeOption) => void;
	selectedComponent: ComponentTypeOption | null;
	favorites: ComponentType[];
	onToggleFavorite: (componentType: ComponentType) => void;
}

const CategoryBrowser: FC<CategoryBrowserProps> = ({
	activeCategory,
	onCategoryChange,
	onComponentSelect,
	selectedComponent,
	favorites,
	onToggleFavorite,
}) => {
	const components = useMemo(() => {
		return getComponentOptionsByCategory(activeCategory);
	}, [activeCategory]);

	const renderComponentGrid = () => {
		if (components.length === 0) {
			return (
				<div className="empty-state">
					<Empty description="该分类下暂无组件" />
				</div>
			);
		}

		return (
			<div className="component-grid">
				{components.map((component) => {
					const isSelected = selectedComponent?.value === component.value;
					const isFavorite = favorites.includes(component.value);

					return (
						<Card
							key={component.value}
							className={`component-card ${isSelected ? 'selected' : ''}`}
							onClick={() => onComponentSelect(component)}
							hoverable
						>
							<div className="component-card-content">
								<div className="component-icon">{component.icon}</div>
								<div className="component-title">{component.label}</div>
								<div className="component-description">
									{component.description}
								</div>
								{!component.canUseFormItem && (
									<Tag color="red" style={{ marginTop: 8, fontSize: '12px' }}>
										非表单组件
									</Tag>
								)}
								<div className="component-actions">
									<Tooltip title={isFavorite ? '取消收藏' : '收藏'}>
										<Button
											type="text"
											size="small"
											icon={
												isFavorite ? (
													<StarFilled style={{ color: '#faad14' }} />
												) : (
													<StarOutlined />
												)
											}
											onClick={(e) => {
												e.stopPropagation();
												onToggleFavorite(component.value);
											}}
										/>
									</Tooltip>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		);
	};

	return (
		<div className="category-browser">
			{/* 左侧分类菜单 */}
			<div className="category-sidebar">
				<Menu
					mode="inline"
					selectedKeys={[activeCategory]}
					onClick={({ key }) => onCategoryChange(key as ComponentCategory)}
					className="category-menu"
				>
					{COMPONENT_CATEGORIES.map((category) => (
						<Menu.Item key={category.id} icon={category.icon}>
							{category.name}
						</Menu.Item>
					))}
				</Menu>
			</div>

			{/* 右侧组件网格 */}
			<div className="component-content">
				<div className="category-header">
					<h3>
						{COMPONENT_CATEGORIES.find((c) => c.id === activeCategory)?.name}
					</h3>
					<span className="component-count">{components.length} 个组件</span>
				</div>
				{renderComponentGrid()}
			</div>
		</div>
	);
};

export default CategoryBrowser;
