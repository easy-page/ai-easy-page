import React, { FC } from 'react';
import {
	Form,
	Input,
	Select,
	Row,
	Col,
	Typography,
	Divider,
	Space,
	Button,
} from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { FormSchema } from '../../../Schema/form';
import {
	FunctionProperty,
	ReactNodeProperty,
} from '../../../Schema/specialProperties';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';
import ReactNodeConfigPanel from './ReactNodeConfigPanel';
import { ComponentSchema } from '../../../Schema/component';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface FormConfigPanelProps {
	properties: FormSchema['properties'];
	onPropertyChange: (propertyPath: string, value: any) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
	componentIndex?: number; // 当前组件的索引
}

const FormConfigPanel: FC<FormConfigPanelProps> = ({
	properties,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
	componentIndex,
}) => {
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
						<ReactNodeConfigPanel
							value={properties.loadingComponent}
							onChange={(value) => {
								onPropertyChange('properties.loadingComponent', value);
							}}
							label="加载组件"
							placeholder="请输入加载组件内容或选择组件"
							onNodeSelect={onNodeSelect}
							onExpand={onExpand}
							onUpdateParentProperty={onUpdateParentProperty}
							propertyPath="loadingComponent"
							componentIndex={componentIndex}
						/>
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
								value={(properties.onSubmit as FunctionProperty)?.content || ''}
								language="typescript"
								height="80px"
								updateOnBlur
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
									(properties.onValuesChange as FunctionProperty)?.content || ''
								}
								language="typescript"
								height="80px"
								updateOnBlur
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

			<Divider />

			<Title level={5}>Store 配置</Title>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item label="Store 初始值">
						<TextArea
							rows={3}
							placeholder="请输入 Store 初始值 (JSON格式)"
							value={JSON.stringify(
								properties.store?.properties?.initialValues || {},
								null,
								2
							)}
							onChange={(e) => {
								try {
									const value = JSON.parse(e.target.value);
									onPropertyChange(
										'properties.store.properties.initialValues',
										value
									);
								} catch (error) {
									// 解析错误时不更新
								}
							}}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item label="最大并发请求数">
						<Input
							type="number"
							min={1}
							placeholder="请输入最大并发请求数"
							value={properties.store?.properties?.maxConcurrentRequests || ''}
							onChange={(e) => {
								const value = e.target.value
									? parseInt(e.target.value)
									: undefined;
								onPropertyChange(
									'properties.store.properties.maxConcurrentRequests',
									value
								);
							}}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item label="Store 模式">
						<Select
							value={properties.store?.properties?.mode || 'default'}
							onChange={(value) =>
								onPropertyChange('properties.store.properties.mode', value)
							}
						>
							<Option value="default">默认模式</Option>
							<Option value="edit">编辑模式</Option>
							<Option value="view">查看模式</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<Title level={5}>初始化请求配置</Title>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item label="初始化请求">
						<TextArea
							rows={4}
							placeholder="请输入初始化请求配置 (JSON格式)"
							value={JSON.stringify(properties.initReqs || {}, null, 2)}
							onChange={(e) => {
								try {
									const value = JSON.parse(e.target.value);
									onPropertyChange('properties.initReqs', value);
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

export default FormConfigPanel;
