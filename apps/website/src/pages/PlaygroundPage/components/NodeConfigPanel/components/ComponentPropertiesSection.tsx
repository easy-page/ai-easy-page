import React, { FC } from 'react';
import { Tabs, Typography } from 'antd';
import { FormSchema } from '../../../Schema/form';
import { ComponentSchema } from '../../../Schema/component';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './index';
import { NodeInfo, getValueByPath } from './utils';

const { Title } = Typography;

interface ComponentPropertiesSectionProps {
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

const ComponentPropertiesSection: FC<ComponentPropertiesSectionProps> = ({
	nodeInfo,
	effectiveSchema,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
}) => {
	if (nodeInfo.type !== 'component') return null;

	// Resolve current component by deep propertyPath to support nested children chains
	const component = getValueByPath(effectiveSchema, nodeInfo.propertyPath) as
		| ComponentSchema
		| undefined;

	if (!component) return null;

	const componentType = component.type;
	const ComponentConfigPanel =
		ComponentConfigPanelMap[
			componentType as keyof typeof ComponentConfigPanelMap
		];

	console.log('qweqwqwewqe:', componentType, ComponentConfigPanelMap);

	const handleComponentPropsChange = (newProps: any) => {
		const mergedProps = {
			...(component?.properties || {}),
			...(newProps || {}),
		} as any;
		if (typeof component?.type === 'string') {
			mergedProps.__componentType = component.type;
		}
		onPropertyChange(`${nodeInfo.propertyPath}.properties`, mergedProps);
	};

	const handleFormItemPropsChange = (newFormItemProps: any) => {
		const merged = {
			...(component?.formItem?.properties || {}),
			...newFormItemProps,
		};
		onPropertyChange(`${nodeInfo.propertyPath}.formItem`, {
			type: 'formItem' as const,
			properties: merged,
		});
	};

	if (component.formItem && ComponentConfigPanel) {
		const tabItems = [
			{
				key: 'formItem',
				label: '表单属性',
				children: (
					<FormItemConfigPanel
						key={`${nodeInfo.propertyPath}-formItem`}
						props={component.formItem.properties || {}}
						onChange={handleFormItemPropsChange}
						onNodeSelect={onNodeSelect}
						onExpand={onExpand}
						onUpdateParentProperty={onUpdateParentProperty}
						componentIndex={nodeInfo.componentIndex}
					/>
				),
			},
			{
				key: 'component',
				label: '组件属性',
				children: (
					<ComponentConfigPanel
						key={`${nodeInfo.propertyPath}-component`}
						props={component.properties || {}}
						onChange={handleComponentPropsChange}
						onNodeSelect={onNodeSelect}
						onExpand={onExpand}
						onUpdateParentProperty={onUpdateParentProperty}
						componentIndex={nodeInfo.componentIndex}
					/>
				),
			},
		];

		return (
			<div className="component-properties">
				<Tabs
					defaultActiveKey="formItem"
					items={tabItems}
					style={{ color: '#fff' }}
					tabBarStyle={{ color: '#fff' }}
				/>
			</div>
		);
	}

	if (component.formItem && !ComponentConfigPanel) {
		return (
			<div className="component-properties">
				<FormItemConfigPanel
					key={`${nodeInfo.propertyPath}-formItem-only`}
					props={component.formItem.properties || {}}
					onChange={handleFormItemPropsChange}
					onNodeSelect={onNodeSelect}
					onExpand={onExpand}
					onUpdateParentProperty={onUpdateParentProperty}
					componentIndex={nodeInfo.componentIndex}
				/>
			</div>
		);
	}

	if (!component.formItem && ComponentConfigPanel) {
		return (
			<div className="component-properties">
				<ComponentConfigPanel
					key={`${nodeInfo.propertyPath}-component-only`}
					props={component.properties || {}}
					onChange={handleComponentPropsChange}
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

export default ComponentPropertiesSection;
