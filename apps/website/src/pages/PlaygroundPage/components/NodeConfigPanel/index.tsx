import { FC } from 'react';
import {
	Form,
	Input,
	Select,
	Button,
	Space,
	Typography,
	Divider,
	Row,
	Col,
	Tabs,
} from 'antd';
import { RobotOutlined, CloseOutlined } from '@ant-design/icons';
import { FormSchema } from '../../Schema';
import {
	FunctionProperty,
	ReactNodeProperty,
} from '../../Schema/specialProperties';
import MonacoEditor from '../ConfigBuilder/components/FormMode/MonacoEditor';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './components';
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
			<div className="form-properties">
				<Title level={5}>表单属性</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="初始值">
							<TextArea
								rows={3}
								placeholder="请输入初始值 (JSON格式)"
								value={JSON.stringify(properties.initialValues || {}, null, 2)}
								onChange={(e) => {
									try {
										const value = JSON.parse(e.target.value);
										onPropertyChange('properties.initialValues', value);
									} catch (error) {
										// 解析错误时不更新
									}
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="表单模式">
							<Select
								value={properties.mode || 'default'}
								onChange={(value) => onPropertyChange('properties.mode', value)}
							>
								<Option value="default">默认模式</Option>
								<Option value="edit">编辑模式</Option>
								<Option value="view">查看模式</Option>
							</Select>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="加载组件">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.loadingComponent as ReactNodeProperty)
											?.content || ''
									}
									language="jsx"
									height="80px"
									onChange={(value: string) => {
										onPropertyChange('properties.loadingComponent', {
											type: 'reactNode',
											content: value,
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Title level={5}>事件处理</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="提交处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.onSubmit as FunctionProperty)?.content || ''
									}
									language="javascript"
									height="80px"
									onChange={(value: string) => {
										onPropertyChange('properties.onSubmit', {
											type: 'function',
											content: value,
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="值变化处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.onValuesChange as FunctionProperty)?.content ||
										''
									}
									language="javascript"
									height="80px"
									onChange={(value: string) => {
										onPropertyChange('properties.onValuesChange', {
											type: 'function',
											content: value,
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</div>
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
				formItem: newFormItemProps,
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
						props={component.formItem || {}}
						onChange={handleFormItemPropsChange}
					/>
				),
			});
		}

		return (
			<div className="component-properties">
				<Title level={5}>组件配置</Title>
				<Tabs items={tabItems} />
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
