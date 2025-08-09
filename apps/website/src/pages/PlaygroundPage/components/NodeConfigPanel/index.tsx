import React, { FC, useEffect } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FormSchema } from '../../Schema/form';
import {
	ReactNodeProperty,
	FunctionProperty,
	FunctionReactNodeProperty,
} from '../../Schema/specialProperties';
import { ComponentSchema } from '../../Schema/component';
import FormConfigPanel from './components/FormConfigPanel';
import ComponentPropertiesSection from './components/ComponentPropertiesSection';
import PropertyConfigSection from './components/PropertyConfigSection';
import ArrayItemConfigSection from './components/ArrayItemConfigSection';
import ReactNodeConfigSection from './components/ReactNodeConfigSection';
import './index.less';
import { useService } from '@/infra/ioc/react';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';
import { parseNodeId, NodeInfo } from './components/utils';

const { Title, Text } = Typography;
const { TextArea } = Input as any;

interface NodeConfigPanelProps {
	selectedNode: string | null;
	onPropertyChange: (propertyPath: string, value: any) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	expandedKeys?: string[];
	onClose?: () => void;
	// 新增：用于更新父组件的属性，使其在左侧树中显示为组件节点
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
}

// NodeInfo 已移动到 utils.ts

const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
	selectedNode,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	expandedKeys = [],
	onClose,
	onUpdateParentProperty,
}) => {
	const chatService = useService(ChatService);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const effectiveSchema = (curVenue?.page_schema as FormSchema) || null;
	// 同步内部展开状态到外部
	useEffect(() => {
		if (onExpand) {
			onExpand(expandedKeys);
		}
	}, [expandedKeys, onExpand]);
	if (!selectedNode) {
		return (
			<div className="node-config-empty">
				<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
					请选择一个节点进行配置
				</Text>
			</div>
		);
	}

	// 如果没有schema但有选中的节点，显示基本配置
	if (!effectiveSchema) {
		return (
			<div
				className="form-properties"
				style={{
					background: 'transparent',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Title level={5} style={{ color: '#fff' }}>
					节点配置
				</Title>
				<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
					请先创建表单结构以进行详细配置
				</Text>
			</div>
		);
	}

	// 解析节点ID和属性路径（已拆分到 utils）

	const nodeInfo = parseNodeId(selectedNode, effectiveSchema);

	// 辅助函数已移动到 utils.ts

	const renderFormProperties = () => {
		if (selectedNode !== 'form') {
			return null;
		}

		const properties = effectiveSchema.properties || {};

		return (
			<FormConfigPanel
				properties={properties}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
				componentIndex={nodeInfo?.componentIndex}
			/>
		);
	};

	const renderComponentProperties = () => {
		if (!nodeInfo || nodeInfo.type !== 'component') return null;
		return (
			<ComponentPropertiesSection
				nodeInfo={nodeInfo as NodeInfo}
				effectiveSchema={effectiveSchema}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
			/>
		);
	};

	const renderArrayItemConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'array-item') return null;

		return (
			<ArrayItemConfigSection
				nodeInfo={nodeInfo}
				effectiveSchema={effectiveSchema}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
			/>
		);
	};

	const renderPropertyConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'property') return null;

		if (!nodeInfo || nodeInfo.type !== 'property') return null;
		return (
			<PropertyConfigSection
				nodeInfo={nodeInfo}
				effectiveSchema={effectiveSchema}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
			/>
		);
	};

	const renderReactNodeConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'reactNode') return null;

		return (
			<ReactNodeConfigSection
				nodeInfo={nodeInfo}
				effectiveSchema={effectiveSchema}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
			/>
		);
	};

	// 处理更新父组件属性的回调
	const handleUpdateParentProperty = (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => {
		// 这里需要根据当前选中的节点来更新对应的属性
		// 例如：如果当前选中的是容器组件，propertyPath 是 'title'
		// 那么需要将 title 属性从 ReactNodeProperty 更新为 ComponentSchema
		if (nodeInfo && nodeInfo.type === 'component') {
			const children = effectiveSchema.properties?.children || [];
			const component = children[nodeInfo.componentIndex!];

			if (component) {
				// 更新组件的属性，将 ReactNodeProperty 替换为 ComponentSchema
				const newProps = {
					...component.props,
					[propertyPath]: componentSchema,
				};

				const newChildren = [...children];
				newChildren[nodeInfo.componentIndex!] = {
					...newChildren[nodeInfo.componentIndex!],
					props: newProps,
				};

				// 通知父组件更新
				onPropertyChange('properties.children', newChildren);
			}
		} else if (nodeInfo && nodeInfo.type === 'property') {
			// 如果当前选中的是属性节点，直接更新该属性
			onPropertyChange(nodeInfo.propertyPath, componentSchema);
		}
	};

	return (
		<div className="node-config-panel">
			<div className="config-header">
				<Title level={4} style={{ color: '#fff' }}>
					组件配置
				</Title>
				{onClose && (
					<Button type="text" icon={<CloseOutlined />} onClick={onClose} />
				)}
			</div>

			<div className="config-content">
				{renderFormProperties()}
				{renderComponentProperties()}
				{renderPropertyConfig()}
				{renderArrayItemConfig()}
				{renderReactNodeConfig()}
			</div>
		</div>
	);
};

export default NodeConfigPanel;
