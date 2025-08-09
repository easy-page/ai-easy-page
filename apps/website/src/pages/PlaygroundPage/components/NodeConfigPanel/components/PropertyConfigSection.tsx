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
import ReactNodeArrayConfigPanel from './ReactNodeArrayConfigPanel';
import { NodeInfo } from './utils';

const { Title } = Typography;

interface PropertyConfigSectionProps {
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

const PropertyConfigSection: FC<PropertyConfigSectionProps> = ({
	nodeInfo,
	effectiveSchema,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
}) => {
	if (nodeInfo.type !== 'property') return null;

	const children = effectiveSchema.properties?.children || [];
	const component = children[nodeInfo.componentIndex!];
	const propValue = component?.props?.[nodeInfo.propName!];

	if (propValue && typeof propValue === 'object' && 'type' in propValue) {
		const handlePropertyChange = (newValue: any) => {
			const newChildren = [...children];
			const newComponent = {
				...newChildren[nodeInfo.componentIndex!],
			} as ComponentSchema;
			newComponent.props = {
				...newComponent.props,
				[nodeInfo.propName!]: newValue,
			};
			newChildren[nodeInfo.componentIndex!] = newComponent;
			onPropertyChange('properties.children', newChildren);
		};

		if ((propValue as any).type === 'reactNode') {
			return (
				<div className="property-config">
					<Title level={5} style={{ color: '#fff' }}>
						组件属性配置 - {nodeInfo.propName}
					</Title>
					<ReactNodeConfigPanel
						value={propValue as ReactNodeProperty}
						onChange={handlePropertyChange}
						label={`${nodeInfo.propName} (ReactNode)`}
						onNodeSelect={onNodeSelect}
						onExpand={onExpand}
						onUpdateParentProperty={onUpdateParentProperty}
						propertyPath={nodeInfo.propName}
						componentIndex={nodeInfo.componentIndex}
					/>
				</div>
			);
		}

		if ((propValue as any).type === 'function') {
			return (
				<div className="property-config">
					<Title level={5} style={{ color: '#fff' }}>
						组件属性配置 - {nodeInfo.propName}
					</Title>
					<FunctionPropertyConfigPanel
						value={propValue as FunctionProperty}
						onChange={handlePropertyChange}
						label={`${nodeInfo.propName} (Function)`}
					/>
				</div>
			);
		}

		if ((propValue as any).type === 'functionReactNode') {
			return (
				<div className="property-config">
					<Title level={5} style={{ color: '#fff' }}>
						组件属性配置 - {nodeInfo.propName}
					</Title>
					<FunctionReactNodePropertyConfigPanel
						value={propValue as FunctionReactNodeProperty}
						onChange={handlePropertyChange}
						label={`${nodeInfo.propName} (FunctionReactNode)`}
					/>
				</div>
			);
		}
	}

	if (
		Array.isArray(propValue) &&
		propValue.length > 0 &&
		(propValue[0] as any)?.type === 'reactNode'
	) {
		return (
			<div className="property-config">
				<Title level={5} style={{ color: '#fff' }}>
					组件属性配置 - {nodeInfo.propName}
				</Title>
				<ReactNodeArrayConfigPanel
					value={propValue as ReactNodeProperty[]}
					onChange={(newValue) => {
						const newChildren = [...children];
						const newComponent = {
							...newChildren[nodeInfo.componentIndex!],
						} as ComponentSchema;
						newComponent.props = {
							...newComponent.props,
							[nodeInfo.propName!]: newValue,
						};
						newChildren[nodeInfo.componentIndex!] = newComponent;
						onPropertyChange('properties.children', newChildren);
					}}
					label={`${nodeInfo.propName} (ReactNodeArray)`}
					onNodeSelect={onNodeSelect}
					onExpand={onExpand}
					onUpdateParentProperty={onUpdateParentProperty}
					componentIndex={nodeInfo.componentIndex}
				/>
			</div>
		);
	}

	return null;
};

export default PropertyConfigSection;
