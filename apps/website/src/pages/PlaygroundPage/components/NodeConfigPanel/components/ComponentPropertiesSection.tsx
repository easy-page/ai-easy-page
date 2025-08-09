import React, { FC } from 'react';
import { Tabs, Typography } from 'antd';
import { FormSchema } from '../../../Schema/form';
import { ComponentSchema } from '../../../Schema/component';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './index';
import { NodeInfo } from './utils';

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

	const children = effectiveSchema.properties?.children || [];

	let component: ComponentSchema | undefined;
	if (nodeInfo.propName) {
		const parentComponent = children[nodeInfo.componentIndex!];
		const propValue = parentComponent?.props?.[nodeInfo.propName];
		if (!propValue || typeof propValue !== 'object' || !('type' in propValue)) {
			return null;
		}
		component = propValue as ComponentSchema;
	} else {
		component = children[nodeInfo.componentIndex!];
	}

	if (!component) return null;

	const componentType = component.type;
	const ComponentConfigPanel =
		ComponentConfigPanelMap[
			componentType as keyof typeof ComponentConfigPanelMap
		];

	const handleComponentPropsChange = (newProps: any) => {
		const newChildren = [...children];

		if (nodeInfo.propName) {
			const parentComponent = newChildren[nodeInfo.componentIndex!];
			if (parentComponent && parentComponent.props) {
				const propComponent = parentComponent.props[
					nodeInfo.propName
				] as ComponentSchema;
				if (propComponent) {
					const mergedProps = {
						...(propComponent.props || {}),
						...(newProps || {}),
					};
					// 透传组件类型给原生元素配置面板识别
					if (typeof propComponent.type === 'string') {
						mergedProps.__componentType = propComponent.type;
					}
					parentComponent.props[nodeInfo.propName] = {
						...propComponent,
						props: mergedProps,
					} as ComponentSchema;
				}
			}
		} else {
			const oldComponent = newChildren[
				nodeInfo.componentIndex!
			] as ComponentSchema;
			const mergedProps = {
				...(oldComponent?.props || {}),
				...(newProps || {}),
			};
			if (typeof oldComponent?.type === 'string') {
				mergedProps.__componentType = oldComponent.type;
			}
			newChildren[nodeInfo.componentIndex!] = {
				...oldComponent,
				props: mergedProps,
			} as ComponentSchema;
		}

		onPropertyChange('properties.children', newChildren);
	};

	const handleFormItemPropsChange = (newFormItemProps: any) => {
		const newChildren = [...children];

		if (nodeInfo.propName) {
			const parentComponent = newChildren[nodeInfo.componentIndex!];
			if (parentComponent && parentComponent.props) {
				const propComponent = parentComponent.props[
					nodeInfo.propName
				] as ComponentSchema;
				if (propComponent) {
					parentComponent.props[nodeInfo.propName] = {
						...propComponent,
						formItem: {
							type: 'formItem' as const,
							properties: {
								...propComponent.formItem?.properties,
								...newFormItemProps,
							},
						},
					} as ComponentSchema;
				}
			}
		} else {
			newChildren[nodeInfo.componentIndex!] = {
				...newChildren[nodeInfo.componentIndex!],
				formItem: {
					type: 'formItem' as const,
					properties: {
						...(newChildren[nodeInfo.componentIndex!] as ComponentSchema)
							.formItem?.properties,
						...newFormItemProps,
					},
				},
			} as ComponentSchema;
		}

		onPropertyChange('properties.children', newChildren);
	};

	if (component.formItem && ComponentConfigPanel) {
		const tabItems = [
			{
				key: 'formItem',
				label: '表单属性',
				children: (
					<FormItemConfigPanel
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
						props={component.props || {}}
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
					props={component.props || {}}
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
