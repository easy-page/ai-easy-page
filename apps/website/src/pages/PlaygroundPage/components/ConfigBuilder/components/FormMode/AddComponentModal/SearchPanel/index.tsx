import React, { FC, useMemo } from 'react';
import { Card, Button, Tag, Tooltip, Empty } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { ComponentType } from '../../../../../../constant/componentTypes';
import {
	ComponentTypeOption,
	searchComponentOptions,
} from '../../data/componentOptions';
import './index.less';

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
	const components = useMemo(() => {
		return searchComponentOptions(keyword);
	}, [keyword]);

	const renderComponentGrid = () => {
		if (components.length === 0) {
			return (
				<div className="empty-state">
					<Empty description="未找到相关组件" />
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
		<div className="search-panel">
			<div className="search-header">
				<h3>搜索结果</h3>
				<span className="component-count">{components.length} 个组件</span>
			</div>
			{renderComponentGrid()}
		</div>
	);
};

export default SearchPanel;
