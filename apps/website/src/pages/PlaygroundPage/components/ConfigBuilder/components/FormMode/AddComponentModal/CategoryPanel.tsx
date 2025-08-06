import React, { FC, useMemo } from 'react';
import {
	ComponentCategory,
	COMPONENT_CATEGORIES,
} from '../types/componentCategories';
import {
	ComponentTypeOption,
	getComponentOptionsByCategory,
} from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';
import ComponentList from './ComponentList';

interface CategoryPanelProps {
	category: ComponentCategory;
	onComponentSelect: (component: ComponentTypeOption) => void;
	selectedComponent: ComponentTypeOption | null;
	favorites: ComponentType[];
	onToggleFavorite: (componentType: ComponentType) => void;
}

const CategoryPanel: FC<CategoryPanelProps> = ({
	category,
	onComponentSelect,
	selectedComponent,
	favorites,
	onToggleFavorite,
}) => {
	const components = useMemo(() => {
		const result = getComponentOptionsByCategory(category);
		console.log('CategoryPanel components for category', category, result);
		return result;
	}, [category]);

	console.log('components12323', components, category);

	const categoryConfig = useMemo(() => {
		return COMPONENT_CATEGORIES.find((cat) => cat.id === category);
	}, [category]);

	return (
		<div className="category-panel">
			<div className="category-header">
				<div className="category-icon">{categoryConfig?.icon}</div>
				<div className="category-info">
					<div className="category-name">{categoryConfig?.name}</div>
					<div className="category-description">
						{categoryConfig?.description}
					</div>
				</div>
			</div>

			<ComponentList
				components={components}
				selectedComponent={selectedComponent}
				favorites={favorites}
				onComponentSelect={onComponentSelect}
				onToggleFavorite={onToggleFavorite}
			/>
		</div>
	);
};

export default CategoryPanel;
