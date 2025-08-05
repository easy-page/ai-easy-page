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
} from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { FormSchema } from '../Schema';
import {
	FunctionProperty,
	ReactNodeProperty,
} from '../Schema/specialProperties';
import MonacoEditor from './ConfigBuilder/components/FormMode/MonacoEditor';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NodeConfigPanelProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onPropertyChange: (propertyPath: string, value: any) => void;
}

const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
	schema,
	selectedNode,
	onPropertyChange,
}) => {
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
			<div className="node-config-panel">
				<div className="form-properties">
					<Title level={5}>节点配置</Title>
					<Text type="secondary">请先创建表单结构以进行详细配置</Text>
				</div>
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
					<Col span={8}>
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

					<Col span={8}>
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

					<Col span={8}>
						<Form.Item label="加载组件">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.loadingComponent as ReactNodeProperty)
											?.content || ''
									}
									language="jsx"
									placeholder="请输入加载组件代码"
									height={80}
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
					<Col span={12}>
						<Form.Item label="提交处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.onSubmit as FunctionProperty)?.content || ''
									}
									language="javascript"
									placeholder="请输入提交处理函数"
									height={80}
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

					<Col span={12}>
						<Form.Item label="值变化处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={
										(properties.onValuesChange as FunctionProperty)?.content ||
										''
									}
									language="javascript"
									placeholder="请输入值变化处理函数"
									height={80}
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

		return (
			<div className="component-properties">
				<Title level={5}>组件属性</Title>

				<Row gutter={16}>
					<Col span={8}>
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

					<Col span={16}>
						<Form.Item label="组件属性">
							<TextArea
								rows={3}
								placeholder="请输入组件属性 (JSON格式)"
								value={JSON.stringify(component.props || {}, null, 2)}
								onChange={(e) => {
									try {
										const value = JSON.parse(e.target.value);
										const newChildren = [...children];
										newChildren[childIndex] = {
											...newChildren[childIndex],
											props: value,
										};
										onPropertyChange('properties.children', newChildren);
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
	};

	const formProps = renderFormProperties();
	const componentProps = renderComponentProperties();

	return (
		<div className="node-config-panel">
			{formProps}
			{componentProps}
		</div>
	);
};

export default NodeConfigPanel;
