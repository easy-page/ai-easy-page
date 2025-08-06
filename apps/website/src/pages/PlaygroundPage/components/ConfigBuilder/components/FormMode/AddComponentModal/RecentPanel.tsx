import React, { FC, useMemo } from 'react';
import { Empty } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import {
	ComponentTypeOption,
	ComponentTypeOptionsWithCategory,
} from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';
import ComponentList from './ComponentList';

interface RecentPanelProps {
	recentUsed: ComponentType[];
	onComponentSelect: (component: ComponentTypeOption) => void;
	selectedComponent: ComponentTypeOption | null;
	favorites: ComponentType[];
	onToggleFavorite: (componentType: ComponentType) => void;
}

const RecentPanel: FC<RecentPanelProps> = ({
	recentUsed,
	onComponentSelect,
	selectedComponent,
	favorites,
	onToggleFavorite,
}) => {
	const recentComponents = useMemo(() => {
		return recentUsed
			.map((type) =>
				ComponentTypeOptionsWithCategory.find(
					(component) => component.value === type
				)
			)
			.filter(Boolean) as ComponentTypeOption[];
	}, [recentUsed]);

	return (
		<div className="recent-panel">
			<div className="panel-header">
				<div className="panel-icon">
					<FireOutlined />
				</div>
				<div className="panel-title">
					最近使用的组件 ({recentComponents.length})
				</div>
			</div>

			{recentComponents.length > 0 ? (
				<ComponentList
					components={recentComponents}
					selectedComponent={selectedComponent}
					favorites={favorites}
					onComponentSelect={onComponentSelect}
					onToggleFavorite={onToggleFavorite}
				/>
			) : (
				<div className="empty-state">
					<Empty
						image={<FireOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
						description="暂无最近使用的组件"
					/>
				</div>
			)}
		</div>
	);
};

export default RecentPanel;
