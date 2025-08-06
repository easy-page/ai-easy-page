import React, { FC, useState } from 'react';
import {
	Form,
	Input,
	Select,
	Button,
	Space,
	Typography,
	Card,
	Tabs,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ReactNodeProperty } from '../../../Schema/specialProperties';
import { ComponentSchema } from '../../../Schema/component';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';
import {
	ComponentType,
	ComponentDisplayNames,
} from '../../ConfigBuilder/components/FormMode/ComponentTypes';

const { Option } = Select;
const { Text, Title } = Typography;

interface ReactNodeConfigPanelProps {
	value?: ReactNodeProperty;
	onChange?: (value: ReactNodeProperty) => void;
	label?: string;
	placeholder?: string;
}

const ReactNodeConfigPanel: FC<ReactNodeConfigPanelProps> = ({
	value,
	onChange,
	label = 'React节点',
	placeholder = '请输入JSX内容或选择组件',
}) => {
	const [configType, setConfigType] = useState<'jsx' | 'schema'>(
		value && value.useSchema ? 'schema' : 'jsx'
	);

	const handleTypeChange = (type: 'jsx' | 'schema') => {
		setConfigType(type);
		if (type === 'jsx') {
			onChange?.({
				type: 'reactNode',
				content: '',
			});
		} else {
			onChange?.({
				type: 'reactNode',
				useSchema: true,
				schema: {
					type: 'Input',
					props: {},
				} as ComponentSchema,
			});
		}
	};

	const handleJSXChange = (content: string) => {
		onChange?.({
			type: 'reactNode',
			content,
		});
	};

	const handleSchemaChange = (componentSchema: ComponentSchema) => {
		onChange?.({
			type: 'reactNode',
			useSchema: true,
			schema: componentSchema,
		});
	};

	const renderJSXConfig = () => (
		<MonacoEditor
			value={value && 'content' in value ? value.content || '' : ''}
			onChange={handleJSXChange}
			language="jsx"
			height="120px"
		/>
	);

	const renderSchemaConfig = () => {
		// 获取 schema 值
		const componentSchema =
			value?.schema || ({ type: 'Input', props: {} } as ComponentSchema);

		return (
			<div>
				<Form.Item label="组件类型">
					<Select
						value={componentSchema.type}
						onChange={(type) => {
							handleSchemaChange({
								...componentSchema,
								type,
							});
						}}
					>
						{Object.entries(ComponentDisplayNames).map(([key, name]) => (
							<Option key={key} value={key}>
								{name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="组件属性">
					<MonacoEditor
						value={JSON.stringify(componentSchema.props || {}, null, 2)}
						onChange={(content) => {
							try {
								const props = JSON.parse(content);
								handleSchemaChange({
									...componentSchema,
									props,
								});
							} catch (error) {
								// 解析错误时不更新
							}
						}}
						language="json"
						height="120px"
					/>
				</Form.Item>
			</div>
		);
	};

	return (
		<Card size="small" style={{ marginBottom: 16 }}>
			<Title level={5}>{label}</Title>

			<Form.Item label="配置类型">
				<Select value={configType} onChange={handleTypeChange}>
					<Option value="jsx">JSX内容</Option>
					<Option value="component">组件配置</Option>
				</Select>
			</Form.Item>

			<Tabs
				activeKey={configType}
				items={[
					{
						key: 'jsx',
						label: 'JSX内容',
						children: renderJSXConfig(),
					},
					{
						key: 'schema',
						label: '组件配置',
						children: renderSchemaConfig(),
					},
				]}
			/>
		</Card>
	);
};

export default ReactNodeConfigPanel;
