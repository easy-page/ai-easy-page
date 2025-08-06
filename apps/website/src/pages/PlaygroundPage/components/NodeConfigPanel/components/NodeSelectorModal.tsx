import React, { FC, useState } from 'react';
import { Modal, Tree, Button, Space, Typography, Form, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ComponentSchema } from '../../../Schema/component';
import {
	ComponentType,
	ComponentDisplayNames,
} from '../../ConfigBuilder/components/FormMode/ComponentTypes';

const { Option } = Select;
const { Text } = Typography;

interface NodeSelectorModalProps {
	visible: boolean;
	onCancel: () => void;
	onConfirm: (componentSchema: ComponentSchema) => void;
	title?: string;
}

interface TreeNode {
	key: string;
	title: string;
	children?: TreeNode[];
}

const NodeSelectorModal: FC<NodeSelectorModalProps> = ({
	visible,
	onCancel,
	onConfirm,
	title = '选择组件',
}) => {
	const [selectedType, setSelectedType] = useState<string>('Input');

	const handleConfirm = () => {
		const componentSchema: ComponentSchema = {
			type: selectedType as ComponentType,
			props: {},
		};
		onConfirm(componentSchema);
	};

	const componentOptions = Object.entries(ComponentDisplayNames).map(
		([key, name]) => ({
			key,
			title: name,
		})
	);

	return (
		<Modal
			title={title}
			open={visible}
			onCancel={onCancel}
			onOk={handleConfirm}
			width={600}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					取消
				</Button>,
				<Button key="confirm" type="primary" onClick={handleConfirm}>
					确认
				</Button>,
			]}
		>
			<Form layout="vertical">
				<Form.Item label="组件类型" required>
					<Select
						value={selectedType}
						onChange={setSelectedType}
						placeholder="请选择组件类型"
					>
						{componentOptions.map(({ key, title }) => (
							<Option key={key} value={key}>
								{title}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="组件预览">
					<Text type="secondary">
						已选择:{' '}
						{ComponentDisplayNames[selectedType as ComponentType] ||
							selectedType}
					</Text>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default NodeSelectorModal;
