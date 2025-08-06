import React, { FC } from 'react';
import { List, Button, Tooltip, Tag } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { ComponentTypeOption } from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';

interface ComponentListProps {
	components: ComponentTypeOption[];
	selectedComponent: ComponentTypeOption | null;
	favorites: ComponentType[];
	onComponentSelect: (component: ComponentTypeOption) => void;
	onToggleFavorite: (componentType: ComponentType) => void;
}

const ComponentList: FC<ComponentListProps> = ({
	components,
	selectedComponent,
	favorites,
	onComponentSelect,
	onToggleFavorite,
}) => {
	const handleFavoriteClick = (
		e: React.MouseEvent,
		componentType: ComponentType
	) => {
		e.stopPropagation();
		onToggleFavorite(componentType);
	};

	return (
		<List
			className="component-list"
			dataSource={components}
			renderItem={(component) => {
				const isSelected = selectedComponent?.value === component.value;
				const isFavorite = favorites.includes(component.value);

				return (
					<List.Item
						className={`component-list-item ${isSelected ? 'selected' : ''}`}
						onClick={() => onComponentSelect(component)}
					>
						<div className="component-item-content">
							<div className="component-item-icon">{component.icon}</div>
							<div className="component-item-info">
								<div className="component-item-title">{component.label}</div>
								<div className="component-item-description">
									{component.description}
								</div>
								{!component.canUseFormItem && (
									<Tag size="small" color="red" style={{ marginTop: 4 }}>
										非表单组件
									</Tag>
								)}
							</div>
							<div className="component-item-actions">
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
										onClick={(e) => handleFavoriteClick(e, component.value)}
									/>
								</Tooltip>
							</div>
						</div>
					</List.Item>
				);
			}}
		/>
	);
};

export default ComponentList;
