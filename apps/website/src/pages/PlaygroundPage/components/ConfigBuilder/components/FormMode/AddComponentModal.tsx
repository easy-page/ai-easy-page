import React, { FC, useState, useEffect } from 'react';
import { Modal, Form, Select, Switch, Space, Alert } from 'antd';
import { ComponentType, ComponentTypeOptions } from './ComponentTypes';
import { getComponentConfig, canUseFormItem } from './ComponentConfig';

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
	const [selectedComponentType, setSelectedComponentType] =
		useState<ComponentType | null>(null);

	const handleOk = () => {
		form.validateFields().then((values) => {
			onOk(values.componentType, isFormComponent);
			form.resetFields();
		});
	};

	const handleCancel = () => {
		form.resetFields();
		setSelectedComponentType(null);
		setIsFormComponent(defaultIsFormComponent);
		onCancel();
	};

	// 当组件类型改变时，自动调整FormItem选项
	const handleComponentTypeChange = (componentType: ComponentType) => {
		setSelectedComponentType(componentType);
		const config = getComponentConfig(componentType);

		console.log(`组件类型: ${componentType}, 配置:`, config);

		// 如果组件不能使用FormItem，强制设置为false
		if (!config.canUseFormItem) {
			setIsFormComponent(false);
			console.log(`组件 ${componentType} 不能使用FormItem，已强制设置为false`);
		} else {
			// 如果可以，恢复默认值
			setIsFormComponent(defaultIsFormComponent);
			console.log(
				`组件 ${componentType} 可以使用FormItem，设置为默认值: ${defaultIsFormComponent}`
			);
		}
	};

	// 获取当前选中组件的配置
	const currentConfig = selectedComponentType
		? getComponentConfig(selectedComponentType)
		: null;

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
					<Select
						placeholder="请选择要添加的组件"
						onChange={handleComponentTypeChange}
					>
						{ComponentTypeOptions.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				{/* 显示组件描述 */}
				{/* {currentConfig && (
					<Alert
						message={currentConfig.description}
						type="info"
						showIcon
						style={{ marginBottom: 16 }}
					/>
				)} */}

				<Form.Item label="是否为表单组件">
					<Space>
						<Switch
							checked={isFormComponent}
							onChange={setIsFormComponent}
							disabled={currentConfig ? !currentConfig.canUseFormItem : false}
						/>
						<span>{isFormComponent ? '是' : '否'}</span>
					</Space>
					<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
						{currentConfig && !currentConfig.canUseFormItem ? (
							<span style={{ color: '#ff4d4f' }}>
								{currentConfig.note || '此组件不能使用FormItem包裹'}
							</span>
						) : isFormComponent ? (
							'表单组件会被包裹在FormItem中，支持表单验证和标签显示'
						) : (
							'非表单组件直接渲染，不包含表单相关的功能'
						)}
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddComponentModal;
