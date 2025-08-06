import React, { FC, useMemo } from 'react';
import { Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
	ComponentTypeOption,
	searchComponentOptions,
} from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';
import ComponentCard from './ComponentCard';

interface SearchPanelProps {
	keyword: string;
	onComponentSelect: (component: ComponentTypeOption) => void;
	selectedComponent: ComponentTypeOption | null;
	favorites: ComponentType[];
	onToggleFavorite: (componentType: ComponentType) => void;
}

const SearchPanel: FC<SearchPanelProps> = ({
	keyword,
	onComponentSelect,
	selectedComponent,
	favorites,
	onToggleFavorite,
}) => {
	const searchResults = useMemo(() => {
		if (!keyword.trim()) {
			return [];
		}
		return searchComponentOptions(keyword);
	}, [keyword]);

	return (
		<div className="search-panel">
			<div className="search-results">
				{keyword.trim() ? (
					searchResults.length > 0 ? (
						<div className="component-grid">
							{searchResults.map((component) => (
								<ComponentCard
									key={component.value}
									component={component}
									isSelected={selectedComponent?.value === component.value}
									isFavorite={favorites.includes(component.value)}
									onSelect={onComponentSelect}
									onToggleFavorite={onToggleFavorite}
								/>
							))}
						</div>
					) : (
						<div className="no-results">
							<Empty
								image={
									<SearchOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
								}
								description={`未找到包含"${keyword}"的组件`}
							/>
						</div>
					)
				) : (
					<div className="no-results">
						<Empty
							image={
								<SearchOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
							}
							description="请输入关键词搜索组件"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchPanel;
