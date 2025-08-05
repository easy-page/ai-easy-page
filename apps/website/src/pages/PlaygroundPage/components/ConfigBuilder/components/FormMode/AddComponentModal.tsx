import React, { FC, useState } from 'react';
import { Modal, Select, Checkbox, Form, Input, message } from 'antd';
import {
	ComponentType,
	ComponentDisplayNames,
	getDefaultComponentProps,
} from './ComponentTypes';

const { Option } = Select;

interface AddComponentModalProps {
	visible: boolean;
	onCancel: () => void;
	onConfirm: (componentType: ComponentType, isFormComponent: boolean) => void;
	defaultIsFormComponent?: boolean;
}

const AddComponentModal: FC<AddComponentModalProps> = ({
	visible,
	onCancel,
	onConfirm,
	defaultIsFormComponent = true,
}) => {
	const [form] = Form.useForm();
	const [selectedComponent, setSelectedComponent] =
		useState<ComponentType | null>(null);
	const [isFormComponent, setIsFormComponent] = useState<boolean>(
		defaultIsFormComponent
	);

	const handleOk = () => {
		if (!selectedComponent) {
			message.error('请选择要添加的组件');
			return;
		}
		onConfirm(selectedComponent, isFormComponent);
		handleCancel();
	};

	const handleCancel = () => {
		setSelectedComponent(null);
		form.resetFields();
		onCancel();
	};

	const componentOptions = Object.values(ComponentType).map((type) => ({
		value: type,
		label: ComponentDisplayNames[type],
	}));

	return (
		<Modal
			title="添加组件"
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			width={500}
			okText="确定"
			cancelText="取消"
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label="选择组件"
					name="componentType"
					rules={[{ required: true, message: '请选择组件类型' }]}
				>
					<Select
						placeholder="请选择要添加的组件"
						onChange={(value) => setSelectedComponent(value)}
						showSearch
						filterOption={(input, option) =>
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
						}
					>
						{componentOptions.map((option) => (
							<Option
								key={option.value}
								value={option.value}
								label={option.label}
							>
								{option.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="组件设置">
					<Checkbox
						checked={isFormComponent}
						onChange={(e) => setIsFormComponent(e.target.checked)}
					>
						是否为表单组件
					</Checkbox>
					<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
						{isFormComponent
							? '表单组件会被包裹在 FormItem 中，支持表单验证和标签显示'
							: '非表单组件直接渲染，不包含表单相关功能'}
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddComponentModal;
