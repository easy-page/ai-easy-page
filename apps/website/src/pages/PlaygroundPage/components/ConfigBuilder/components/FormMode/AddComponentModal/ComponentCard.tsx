import React, { FC } from 'react';
import { Card, Button, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { ComponentTypeOption } from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';

interface ComponentCardProps {
	component: ComponentTypeOption;
	isSelected: boolean;
	isFavorite: boolean;
	onSelect: (component: ComponentTypeOption) => void;
	onToggleFavorite: (componentType: ComponentType) => void;
}

const ComponentCard: FC<ComponentCardProps> = ({
	component,
	isSelected,
	isFavorite,
	onSelect,
	onToggleFavorite,
}) => {
	const handleCardClick = () => {
		onSelect(component);
	};

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleFavorite(component.value);
	};

	return (
		<Card
			className={`component-card ${isSelected ? 'selected' : ''}`}
			onClick={handleCardClick}
			bodyStyle={{ padding: '16px', textAlign: 'center', position: 'relative' }}
		>
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
						onClick={handleFavoriteClick}
					/>
				</Tooltip>
			</div>

			<div className="component-icon">{component.icon}</div>

			<div className="component-title">{component.label}</div>

			<div className="component-description">{component.description}</div>

			{!component.canUseFormItem && (
				<div
					style={{
						marginTop: '8px',
						fontSize: '11px',
						color: '#ff4d4f',
						backgroundColor: '#fff2f0',
						padding: '2px 6px',
						borderRadius: '3px',
						border: '1px solid #ffccc7',
					}}
				>
					非表单组件
				</div>
			)}
		</Card>
	);
};

export default ComponentCard;
