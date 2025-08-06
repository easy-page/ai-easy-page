import React, { FC, useState } from 'react';
import { Card, Typography, Button, Space, Switch, Form } from 'antd';
import { RobotOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNodeProperty } from '../../../Schema/specialProperties';
import { ComponentSchema } from '../../../Schema/component';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';
import NodeSelectorModal from './NodeSelectorModal';

const { Title, Text } = Typography;

interface ReactNodeConfigPanelProps {
	value?: ReactNodeProperty;
	onChange?: (value: ReactNodeProperty) => void;
	label?: string;
	placeholder?: string;
}

const ReactNodeConfigPanel: FC<ReactNodeConfigPanelProps> = ({
	value,
	onChange,
	label = 'React节点配置',
	placeholder = '请输入React节点代码',
}) => {
	const [isSchemaMode, setIsSchemaMode] = useState(value?.useSchema || false);
	const [modalVisible, setModalVisible] = useState(false);

	const handleStringModeChange = (content: string) => {
		onChange?.({
			type: 'reactNode',
			content,
			useSchema: false,
		});
	};

	const handleSchemaModeChange = (schema: ComponentSchema) => {
		onChange?.({
			type: 'reactNode',
			useSchema: true,
			schema,
		});
	};

	const handleModeSwitch = (checked: boolean) => {
		setIsSchemaMode(checked);
		if (checked) {
			// 切换到节点模式时，清空字符串内容
			onChange?.({
				type: 'reactNode',
				useSchema: true,
				schema: value?.schema,
			});
		} else {
			// 切换到字符串模式时，保留字符串内容
			onChange?.({
				type: 'reactNode',
				content: value?.content,
				useSchema: false,
			});
		}
	};

	const handleAIAssist = () => {
		// TODO: 实现AI编辑功能
		console.log('AI编辑功能待实现');
	};

	const handleAddNode = () => {
		setModalVisible(true);
	};

	const handleModalConfirm = (componentSchema: ComponentSchema) => {
		handleSchemaModeChange(componentSchema);
		setModalVisible(false);
	};

	const handleModalCancel = () => {
		setModalVisible(false);
	};

	return (
		<>
			<Card size="small" style={{ marginBottom: 16 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<Title level={5} style={{ margin: 0 }}>
						{label}
					</Title>
					<Space>
						<Form.Item label="节点模式" style={{ margin: 0 }}>
							<Switch
								checked={isSchemaMode}
								onChange={handleModeSwitch}
								checkedChildren="节点"
								unCheckedChildren="字符串"
							/>
						</Form.Item>
						{!isSchemaMode && (
							<Button
								type="primary"
								icon={<RobotOutlined />}
								size="small"
								onClick={handleAIAssist}
							>
								AI编辑
							</Button>
						)}
					</Space>
				</div>

				{!isSchemaMode ? (
					<MonacoEditor
						value={value?.content || ''}
						onChange={handleStringModeChange}
						language="javascript"
						height="200px"
					/>
				) : (
					<div>
						{value?.schema ? (
							<div
								style={{
									padding: 12,
									border: '1px solid #d9d9d9',
									borderRadius: 6,
								}}
							>
								<Text type="secondary">已配置节点: {value.schema.type}</Text>
								<Button
									type="link"
									size="small"
									onClick={handleAddNode}
									style={{ marginLeft: 8 }}
								>
									重新配置
								</Button>
							</div>
						) : (
							<Button
								type="dashed"
								icon={<PlusOutlined />}
								onClick={handleAddNode}
								style={{ width: '100%', height: 100 }}
							>
								添加节点
							</Button>
						)}
					</div>
				)}
			</Card>

			<NodeSelectorModal
				visible={modalVisible}
				onCancel={handleModalCancel}
				onConfirm={handleModalConfirm}
				title="选择React节点组件"
			/>
		</>
	);
};

export default ReactNodeConfigPanel;
