import React, { FC, useMemo } from 'react';
import { Card, Button, Tag, Tooltip, Empty } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { ComponentType } from '../../../../../../constant/componentTypes';
import {
	ComponentTypeOption,
	searchComponentOptions,
} from '../../data/componentOptions';
import './index.less';

interface FavoritePanelProps {
	favorites: ComponentType[];
	onComponentSelect: (component: ComponentTypeOption) => void;
	selectedComponent: ComponentTypeOption | null;
	onToggleFavorite: (componentType: ComponentType) => void;
}

const FavoritePanel: FC<FavoritePanelProps> = ({
	favorites,
	onComponentSelect,
	selectedComponent,
	onToggleFavorite,
}) => {
	const components = useMemo(() => {
		// 获取所有组件，然后过滤出收藏的
		const allComponents = searchComponentOptions('');
		return allComponents.filter((comp) => favorites.includes(comp.value));
	}, [favorites]);

	const renderComponentGrid = () => {
		if (components.length === 0) {
			return (
				<div className="empty-state">
					<Empty description="暂无收藏的组件" />
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
		<div className="favorite-panel">
			<div className="favorite-header">
				<h3>我的收藏</h3>
				<span className="component-count">{components.length} 个组件</span>
			</div>
			{renderComponentGrid()}
		</div>
	);
};

export default FavoritePanel;
