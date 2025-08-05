import React, { FC, useState } from 'react';
import { Modal, Form, Select, Switch, Space } from 'antd';
import { ComponentType, ComponentTypeOptions } from './ComponentTypes';

const { Option } = Select;

interface AddComponentModalProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (componentType: ComponentType, isFormComponent: boolean) => void;
	defaultIsFormComponent?: boolean;
}

const AddComponentModal: FC<AddComponentModalProps> = ({
	visible,
	onCancel,
	onOk,
	defaultIsFormComponent = true,
}) => {
	const [form] = Form.useForm();
	const [isFormComponent, setIsFormComponent] = useState(
		defaultIsFormComponent
	);

	const handleOk = () => {
		form.validateFields().then((values) => {
			onOk(values.componentType, isFormComponent);
			form.resetFields();
		});
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title="添加组件"
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText="确定"
			cancelText="取消"
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label="组件类型"
					name="componentType"
					rules={[{ required: true, message: '请选择组件类型' }]}
				>
					<Select placeholder="请选择要添加的组件">
						{ComponentTypeOptions.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="是否为表单组件">
					<Space>
						<Switch checked={isFormComponent} onChange={setIsFormComponent} />
						<span>{isFormComponent ? '是' : '否'}</span>
					</Space>
					<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
						{isFormComponent
							? '表单组件会被包裹在FormItem中，支持表单验证和标签显示'
							: '非表单组件直接渲染，不包含表单相关的功能'}
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddComponentModal;
