import React, { FC, useState } from 'react';
import { Modal, Tree, Button, Space, Typography, Form, Select } from 'antd';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ComponentSchema } from '../../../Schema/component';
import { ComponentDisplayNames } from '../../ConfigBuilder/components/FormMode/types';
import { ComponentType } from '../../../constant/componentTypes';

const { Option } = Select;
const { Text, Title } = Typography;

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
			title={
				<Title
					level={4}
					style={{
						color: '#fff',
						margin: 0,
						fontSize: '16px',
						fontWeight: 600,
					}}
				>
					{title}
				</Title>
			}
			open={visible}
			onCancel={onCancel}
			onOk={handleConfirm}
			width={600}
			style={{
				top: '20%',
			}}
			styles={{
				content: {
					background: 'rgba(30, 30, 30, 0.95)',
					border: '1px solid rgba(0, 255, 255, 0.3)',
					borderRadius: '12px',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
				},
				header: {
					background: 'rgba(0, 255, 255, 0.05)',
					borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
					borderRadius: '12px 12px 0 0',
					padding: '16px 24px',
				},
				body: {
					padding: '24px',
					background: 'rgba(30, 30, 30, 0.95)',
				},
				footer: {
					background: 'rgba(0, 255, 255, 0.05)',
					borderTop: '1px solid rgba(0, 255, 255, 0.2)',
					borderRadius: '0 0 12px 12px',
					padding: '16px 24px',
				},
			}}
			footer={[
				<Button
					key="cancel"
					onClick={onCancel}
					style={{
						border: '1px solid rgba(255, 255, 255, 0.3)',
						color: 'rgba(255, 255, 255, 0.8)',
						background: 'rgba(255, 255, 255, 0.05)',
						borderRadius: '6px',
						height: '36px',
						padding: '0 16px',
					}}
				>
					取消
				</Button>,
				<Button
					key="confirm"
					type="primary"
					onClick={handleConfirm}
					style={{
						background: 'linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%)',
						border: 'none',
						borderRadius: '6px',
						height: '36px',
						padding: '0 16px',
						fontWeight: 500,
						boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
					}}
				>
					确认
				</Button>,
			]}
		>
			<Form layout="vertical">
				<Form.Item
					label={
						<Text
							style={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontSize: '14px',
								fontWeight: 500,
							}}
						>
							组件类型
						</Text>
					}
					required
					style={{ marginBottom: '20px' }}
				>
					<Select
						value={selectedType}
						onChange={setSelectedType}
						placeholder="请选择组件类型"
						style={{
							width: '100%',
						}}
						dropdownStyle={{
							background: 'rgba(30, 30, 30, 0.95)',
							border: '1px solid rgba(0, 255, 255, 0.3)',
							borderRadius: '8px',
							boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
						}}
					>
						{componentOptions.map(({ key, title }) => (
							<Option key={key} value={key}>
								{title}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label={
						<Text
							style={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontSize: '14px',
								fontWeight: 500,
							}}
						>
							组件预览
						</Text>
					}
				>
					<div
						style={{
							padding: '16px',
							border: '1px solid rgba(0, 255, 255, 0.3)',
							borderRadius: '8px',
							background: 'rgba(0, 255, 255, 0.05)',
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
						}}
					>
						<CheckCircleOutlined
							style={{
								color: 'rgba(0, 255, 255, 0.8)',
								fontSize: '16px',
							}}
						/>
						<Text
							style={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontSize: '14px',
								fontWeight: 500,
							}}
						>
							已选择:{' '}
							<span
								style={{
									color: 'rgba(0, 255, 255, 0.8)',
									fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
									background: 'rgba(0, 255, 255, 0.1)',
									padding: '2px 6px',
									borderRadius: '4px',
									fontSize: '12px',
								}}
							>
								{ComponentDisplayNames[selectedType as ComponentType] ||
									selectedType}
							</span>
						</Text>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default NodeSelectorModal;
