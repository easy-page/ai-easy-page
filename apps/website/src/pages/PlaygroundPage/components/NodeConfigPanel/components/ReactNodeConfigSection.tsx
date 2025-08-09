import React, { FC } from 'react';
import { Typography } from 'antd';
import { FormSchema } from '../../../Schema/form';
import {
	ReactNodeProperty,
	FunctionProperty,
	FunctionReactNodeProperty,
} from '../../../Schema/specialProperties';
import { ComponentSchema } from '../../../Schema/component';
import ReactNodeConfigPanel from './ReactNodeConfigPanel';
import FunctionPropertyConfigPanel from './FunctionPropertyConfigPanel';
import FunctionReactNodePropertyConfigPanel from './FunctionReactNodePropertyConfigPanel';
import { NodeInfo } from './utils';

const { Title, Text } = Typography;

interface ReactNodeConfigSectionProps {
	nodeInfo: NodeInfo;
	effectiveSchema: FormSchema;
	onPropertyChange: (propertyPath: string, value: any) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
}

const ReactNodeConfigSection: FC<ReactNodeConfigSectionProps> = ({
	nodeInfo,
	effectiveSchema,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
}) => {
	if (nodeInfo.type !== 'reactNode') return null;

	const pathParts = nodeInfo.parentPath!.split('.');
	let currentValue: any = effectiveSchema as any;
	for (const part of pathParts) {
		if (currentValue && typeof currentValue === 'object') {
			currentValue = (currentValue as any)[part];
		}
	}

	if (currentValue && Array.isArray((currentValue as any).children)) {
		const reactNodeValue = (currentValue as any).children[nodeInfo.index!];
		if (
			reactNodeValue &&
			typeof reactNodeValue === 'object' &&
			'type' in reactNodeValue
		) {
			const handlePropertyChange = (newValue: any) => {
				onPropertyChange(nodeInfo.propertyPath, newValue);
			};

			if ((reactNodeValue as any).type === 'reactNode') {
				return (
					<div className="reactnode-config">
						<Title level={5} style={{ color: '#fff' }}>
							ReactNode 配置
						</Title>
						<ReactNodeConfigPanel
							value={reactNodeValue as ReactNodeProperty}
							onChange={handlePropertyChange}
							label="ReactNode 配置"
							onNodeSelect={onNodeSelect}
							onExpand={onExpand}
							onUpdateParentProperty={onUpdateParentProperty}
							propertyPath={nodeInfo.propertyPath}
							componentIndex={nodeInfo.componentIndex}
						/>
					</div>
				);
			}

			if ((reactNodeValue as any).type === 'function') {
				return (
					<div className="reactnode-config">
						<Title level={5} style={{ color: '#fff' }}>
							函数配置
						</Title>
						<FunctionPropertyConfigPanel
							value={reactNodeValue as FunctionProperty}
							onChange={handlePropertyChange}
							label="函数配置"
						/>
					</div>
				);
			}

			if ((reactNodeValue as any).type === 'functionReactNode') {
				return (
					<div className="reactnode-config">
						<Title level={5} style={{ color: '#fff' }}>
							函数组件配置
						</Title>
						<FunctionReactNodePropertyConfigPanel
							value={reactNodeValue as FunctionReactNodeProperty}
							onChange={handlePropertyChange}
							label="函数组件配置"
						/>
					</div>
				);
			}
		}
	}

	return (
		<div className="reactnode-config">
			<Title level={5} style={{ color: '#fff' }}>
				ReactNode 配置
			</Title>
			<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
				无法解析的节点类型
			</Text>
		</div>
	);
};

export default ReactNodeConfigSection;
