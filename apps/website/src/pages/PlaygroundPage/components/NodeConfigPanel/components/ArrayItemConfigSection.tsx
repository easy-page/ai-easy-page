import React, { FC } from 'react';
import { Card, Form, Input, Space, Typography } from 'antd';
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
import { getValueByPath, NodeInfo } from './utils';

const { Title, Text } = Typography;
const { TextArea } = Input as any;

interface ArrayItemConfigSectionProps {
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

const ArrayItemConfigSection: FC<ArrayItemConfigSectionProps> = ({
	nodeInfo,
	effectiveSchema,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
}) => {
	if (nodeInfo.type !== 'array-item') return null;

	const currentValue = getValueByPath(effectiveSchema, nodeInfo.propertyPath);
	if (!currentValue) return null;

	if (
		currentValue &&
		typeof currentValue === 'object' &&
		'type' in currentValue
	) {
		const handlePropertyChange = (newValue: any) => {
			onPropertyChange(nodeInfo.propertyPath, newValue);
		};

		if ((currentValue as any).type === 'reactNode') {
			return (
				<div className="array-item-config">
					<Title level={5} style={{ color: '#fff' }}>
						数组项配置 - ReactNode
					</Title>
					<ReactNodeConfigPanel
						value={currentValue as ReactNodeProperty}
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

		if ((currentValue as any).type === 'function') {
			return (
				<div className="array-item-config">
					<Title level={5} style={{ color: '#fff' }}>
						数组项配置 - Function
					</Title>
					<FunctionPropertyConfigPanel
						value={currentValue as FunctionProperty}
						onChange={handlePropertyChange}
						label="函数配置"
					/>
				</div>
			);
		}

		if ((currentValue as any).type === 'functionReactNode') {
			return (
				<div className="array-item-config">
					<Title level={5} style={{ color: '#fff' }}>
						数组项配置 - FunctionReactNode
					</Title>
					<FunctionReactNodePropertyConfigPanel
						value={currentValue as FunctionReactNodeProperty}
						onChange={handlePropertyChange}
						label="函数组件配置"
					/>
				</div>
			);
		}

		if (
			(currentValue as any).type &&
			(currentValue as any).type !== 'reactNode' &&
			(currentValue as any).type !== 'function' &&
			(currentValue as any).type !== 'functionReactNode'
		) {
			const componentSchema = currentValue as ComponentSchema;
			return (
				<div className="array-item-config">
					<Title level={5} style={{ color: '#fff' }}>
						组件配置
					</Title>
					<Card
						size="small"
						style={{
							marginBottom: 16,
							background: 'rgba(0, 255, 255, 0.05)',
							border: '1px solid rgba(0, 255, 255, 0.2)',
						}}
					>
						<Space direction="vertical" style={{ width: '100%' }}>
							<Text strong style={{ color: '#fff' }}>
								组件类型: {componentSchema.type}
							</Text>
							<Text
								type="secondary"
								style={{ color: 'rgba(255, 255, 255, 0.6)' }}
							>
								子组件数量: {componentSchema.children?.length || 0}
							</Text>
						</Space>
					</Card>
					<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
						组件属性配置功能正在开发中...
					</Text>
				</div>
			);
		}
	}

	if (
		currentValue &&
		typeof currentValue === 'object' &&
		!('type' in currentValue)
	) {
		return (
			<div className="array-item-config">
				<Title level={5} style={{ color: '#fff' }}>
					对象配置
				</Title>
				<Form layout="vertical">
					{Object.entries(currentValue).map(([key, value]) => (
						<Form.Item key={key} label={key}>
							{typeof value === 'string' ? (
								<Input
									value={value as string}
									onChange={(e) => {
										const newValue = {
											...currentValue,
											[key]: (e.target as any).value,
										} as any;
										onPropertyChange(nodeInfo.propertyPath, newValue);
									}}
									style={{
										background: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(0, 255, 255, 0.3)',
										color: '#fff',
									}}
								/>
							) : typeof value === 'number' ? (
								<Input
									type="number"
									value={value as number}
									onChange={(e) => {
										const newValue = {
											...currentValue,
											[key]: Number((e.target as any).value),
										} as any;
										onPropertyChange(nodeInfo.propertyPath, newValue);
									}}
									style={{
										background: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(0, 255, 255, 0.3)',
										color: '#fff',
									}}
								/>
							) : (
								<TextArea
									value={JSON.stringify(value, null, 2)}
									onChange={(e: any) => {
										try {
											const parsedValue = JSON.parse(e.target.value);
											const newValue = {
												...currentValue,
												[key]: parsedValue,
											} as any;
											onPropertyChange(nodeInfo.propertyPath, newValue);
										} catch (error) {
											// ignore parse error
										}
									}}
									rows={3}
									style={{
										background: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(0, 255, 255, 0.3)',
										color: '#fff',
									}}
								/>
							)}
						</Form.Item>
					))}
				</Form>
			</div>
		);
	}

	return (
		<div className="array-item-config">
			<Title level={5} style={{ color: '#fff' }}>
				值配置
			</Title>
			<Form layout="vertical">
				<Form.Item label="值">
					<Input
						value={String(currentValue)}
						onChange={(e) => {
							onPropertyChange(nodeInfo.propertyPath, (e.target as any).value);
						}}
						style={{
							background: 'rgba(255, 255, 255, 0.08)',
							border: '1px solid rgba(0, 255, 255, 0.3)',
							color: '#fff',
						}}
					/>
				</Form.Item>
			</Form>
		</div>
	);
};

export default ArrayItemConfigSection;
