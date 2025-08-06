import React, { FC, useMemo } from 'react';
import { Empty } from 'antd';
import { StarFilled } from '@ant-design/icons';
import {
	ComponentTypeOption,
	ComponentTypeOptionsWithCategory,
} from '../data/componentOptions';
import { ComponentType } from '../../../../../constant/componentTypes';
import ComponentList from './ComponentList';

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
				<ComponentList
					components={favoriteComponents}
					selectedComponent={selectedComponent}
					favorites={favorites}
					onComponentSelect={onComponentSelect}
					onToggleFavorite={onToggleFavorite}
				/>
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
