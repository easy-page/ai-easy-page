import React, { FC, useMemo } from 'react';
import { Empty } from 'antd';
import { StarFilled } from '@ant-design/icons';
import {
	ComponentTypeOption,
	ComponentTypeOptionsWithCategory,
} from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';
import ComponentCard from './ComponentCard';

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
	const favoriteComponents = useMemo(() => {
		return ComponentTypeOptionsWithCategory.filter((component) =>
			favorites.includes(component.value)
		);
	}, [favorites]);

	return (
		<div className="favorite-panel">
			<div className="panel-header">
				<div className="panel-icon">
					<StarFilled />
				</div>
				<div className="panel-title">
					收藏的组件 ({favoriteComponents.length})
				</div>
			</div>

			{favoriteComponents.length > 0 ? (
				<div className="component-grid">
					{favoriteComponents.map((component) => (
						<ComponentCard
							key={component.value}
							component={component}
							isSelected={selectedComponent?.value === component.value}
							isFavorite={true}
							onSelect={onComponentSelect}
							onToggleFavorite={onToggleFavorite}
						/>
					))}
				</div>
			) : (
				<div className="empty-state">
					<Empty
						image={<StarFilled style={{ fontSize: 48, color: '#d9d9d9' }} />}
						description="暂无收藏的组件"
					/>
				</div>
			)}
		</div>
	);
};

export default FavoritePanel;
