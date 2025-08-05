import { FC } from 'react';
import {
	Form,
	Input,
	Select,
	Button,
	Typography,
	Divider,
	Row,
	Col,
	Tabs,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FormSchema } from '../../Schema';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './components';
import FormConfigPanel from './components/FormConfigPanel';
import { getDefaultComponentPropsSchema } from '../../Schema/componentProps';
import './index.less';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NodeConfigPanelProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onPropertyChange: (propertyPath: string, value: any) => void;
	onClose?: () => void;
}

const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
	schema,
	selectedNode,
	onPropertyChange,
	onClose,
}) => {
	console.log('NodeConfigPanel render:', { schema, selectedNode, onClose });

	if (!selectedNode) {
		return (
			<div className="node-config-empty">
				<Text type="secondary">请选择一个节点进行配置</Text>
			</div>
		);
	}

	// 如果没有schema但有选中的节点，显示基本配置
	if (!schema) {
		return (
			<div className="form-properties">
				<Title level={5}>节点配置</Title>
				<Text type="secondary">请先创建表单结构以进行详细配置</Text>
			</div>
		);
	}

	const renderFormProperties = () => {
		if (selectedNode !== 'form') {
			return null;
		}

		const properties = schema.properties || {};

		return (
			<FormConfigPanel
				properties={properties}
				onPropertyChange={onPropertyChange}
			/>
		);
	};

	const renderComponentProperties = () => {
		if (selectedNode === 'form') return null;

		// 解析节点ID获取对应的组件
		const nodeIdParts = selectedNode.split('-');
		if (nodeIdParts.length < 2) return null;

		const childIndex = parseInt(nodeIdParts[1]);
		const children = schema.properties?.children || [];
		const component = children[childIndex];

		if (!component) return null;

		const componentType = component.type;
		const ComponentConfigPanel =
			ComponentConfigPanelMap[
				componentType as keyof typeof ComponentConfigPanelMap
			];

		const handleComponentPropsChange = (newProps: any) => {
			const newChildren = [...children];
			newChildren[childIndex] = {
				...newChildren[childIndex],
				props: newProps,
			};
			onPropertyChange('properties.children', newChildren);
		};

		const handleFormItemPropsChange = (newFormItemProps: any) => {
			const newChildren = [...children];
			newChildren[childIndex] = {
				...newChildren[childIndex],
				formItem: {
					type: 'formItem' as const,
					properties: newFormItemProps,
				},
			};
			onPropertyChange('properties.children', newChildren);
		};

		// 如果没有对应的配置面板，显示默认的JSON编辑器
		if (!ComponentConfigPanel) {
			return (
				<div className="component-properties">
					<Title level={5}>组件属性</Title>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item label="组件类型">
								<Input
									value={component.type || ''}
									onChange={(e) => {
										const newChildren = [...children];
										newChildren[childIndex] = {
											...newChildren[childIndex],
											type: e.target.value,
										};
										onPropertyChange('properties.children', newChildren);
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label="组件属性">
								<TextArea
									rows={3}
									placeholder="请输入组件属性 (JSON格式)"
									value={JSON.stringify(component.props || {}, null, 2)}
									onChange={(e) => {
										try {
											const value = JSON.parse(e.target.value);
											handleComponentPropsChange(value);
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
				</div>
			);
		}

		// 使用专门的配置面板
		const tabItems = [
			{
				key: 'component',
				label: '组件属性',
				children: (
					<ComponentConfigPanel
						props={
							component.props ||
							getDefaultComponentPropsSchema(componentType).properties
						}
						onChange={handleComponentPropsChange}
					/>
				),
			},
		];

		// 如果是表单组件，添加FormItem配置
		if (component.formItem !== undefined) {
			tabItems.push({
				key: 'formItem',
				label: '表单项属性',
				children: (
					<FormItemConfigPanel
						props={component.formItem.properties || {}}
						onChange={handleFormItemPropsChange}
					/>
				),
			});
		}

		// 如果是表单组件，默认显示FormItem属性面板
		const defaultActiveKey =
			component.formItem !== undefined ? 'formItem' : 'component';

		return (
			<div className="component-properties">
				<Title level={5}>组件配置</Title>
				<Tabs items={tabItems} defaultActiveKey={defaultActiveKey} />
			</div>
		);
	};

	const formProps = renderFormProperties();
	const componentProps = renderComponentProperties();

	return (
		<div className="node-config-panel">
			{/* 关闭按钮 */}
			{onClose && (
				<Button
					type="text"
					icon={<CloseOutlined />}
					onClick={onClose}
					className="config-panel-close-btn"
				/>
			)}
			{formProps}
			{componentProps}
		</div>
	);
};

export default NodeConfigPanel;
