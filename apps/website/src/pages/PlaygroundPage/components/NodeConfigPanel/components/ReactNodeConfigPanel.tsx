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
import {
	ReactNodeProperty,
	ComponentSchema,
} from '../../../Schema/specialProperties';
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
	const [configType, setConfigType] = useState<'jsx' | 'component'>(
		value && 'type' in value && value.type !== 'reactNode' ? 'component' : 'jsx'
	);

	const handleTypeChange = (type: 'jsx' | 'component') => {
		setConfigType(type);
		if (type === 'jsx') {
			onChange?.({
				type: 'reactNode',
				content: '',
			});
		} else {
			onChange?.({
				type: 'Input',
				props: {},
			} as ComponentSchema);
		}
	};

	const handleJSXChange = (content: string) => {
		onChange?.({
			type: 'reactNode',
			content,
		});
	};

	const handleComponentChange = (componentSchema: ComponentSchema) => {
		onChange?.(componentSchema);
	};

	const renderJSXConfig = () => (
		<MonacoEditor
			value={value && 'content' in value ? value.content : ''}
			onChange={handleJSXChange}
			language="jsx"
			height="120px"
			placeholder={placeholder}
		/>
	);

	const renderComponentConfig = () => {
		const componentSchema =
			value && 'type' in value && value.type !== 'reactNode'
				? (value as ComponentSchema)
				: ({ type: 'Input', props: {} } as ComponentSchema);

		return (
			<div>
				<Form.Item label="组件类型">
					<Select
						value={componentSchema.type}
						onChange={(type) => {
							handleComponentChange({
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
								handleComponentChange({
									...componentSchema,
									props,
								});
							} catch (error) {
								// 解析错误时不更新
							}
						}}
						language="json"
						height="120px"
						placeholder="请输入组件属性 (JSON格式)"
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
						key: 'component',
						label: '组件配置',
						children: renderComponentConfig(),
					},
				]}
			/>
		</Card>
	);
};

export default ReactNodeConfigPanel;
