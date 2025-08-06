import React, { FC, useMemo } from 'react';
import {
	ComponentCategory,
	COMPONENT_CATEGORIES,
} from '../types/componentCategories';
import {
	ComponentTypeOption,
	getComponentOptionsByCategory,
} from '../data/componentOptions';
import ComponentList from './ComponentList';
import { ComponentType } from '../types';

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

	return (
		<div className="category-panel">
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
