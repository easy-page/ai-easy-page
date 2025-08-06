import React, { FC, useState, useEffect } from 'react';
import {
	Tabs,
	Form,
	Input,
	InputNumber,
	Switch,
	Select,
	Space,
	Button,
	message,
} from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import MonacoEditor from './MonacoEditor';
import { FormItemProps } from './types';
import { ComponentType } from '@/pages/PlaygroundPage/constant/componentTypes';

const { Option } = Select;
const { TextArea } = Input;

interface ComponentConfigPanelProps {
	componentType: ComponentType;
	isFormComponent: boolean;
	componentProps: any;
	formItemProps: FormItemProps;
	onComponentPropsChange: (props: any) => void;
	onFormItemPropsChange: (props: FormItemProps) => void;
}

const ComponentConfigPanel: FC<ComponentConfigPanelProps> = ({
	componentType,
	isFormComponent,
	componentProps,
	formItemProps,
	onComponentPropsChange,
	onFormItemPropsChange,
}) => {
	const [componentForm] = Form.useForm();
	const [formItemForm] = Form.useForm();

	useEffect(() => {
		componentForm.setFieldsValue(componentProps);
	}, [componentProps, componentForm]);

	useEffect(() => {
		formItemForm.setFieldsValue(formItemProps);
	}, [formItemProps, formItemForm]);

	const handleComponentPropsChange = (changedValues: any, allValues: any) => {
		onComponentPropsChange(allValues);
	};

	const handleFormItemPropsChange = (changedValues: any, allValues: any) => {
		onFormItemPropsChange(allValues);
	};

	const handleAIEdit = () => {
		message.info('AI 编辑功能暂未实现，敬请期待...');
	};

	const renderCommonProps = () => (
		<>
			<Form.Item label="ID" name="id">
				<Input placeholder="请输入组件ID" />
			</Form.Item>
			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>
			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch />
			</Form.Item>
		</>
	);

	const renderFormItemProps = () => (
		<>
			<Form.Item label="标签" name="label">
				<Input placeholder="请输入标签文本" />
			</Form.Item>
			<Form.Item label="必填" name="required" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item label="标签布局" name="labelLayout">
				<Select>
					<Option value="vertical">垂直</Option>
					<Option value="horizontal">水平</Option>
				</Select>
			</Form.Item>
		</>
	);

	const tabItems = [
		{
			key: 'component',
			label: '组件属性',
			children: (
				<Form
					form={componentForm}
					layout="vertical"
					onValuesChange={handleComponentPropsChange}
				>
					{renderCommonProps()}
				</Form>
			),
		},
	];

	if (isFormComponent) {
		tabItems.push({
			key: 'formItem',
			label: '表单项属性',
			children: (
				<Form
					form={formItemForm}
					layout="vertical"
					onValuesChange={handleFormItemPropsChange}
				>
					{renderFormItemProps()}
				</Form>
			),
		});
	}

	return (
		<div className="component-config-panel">
			<Tabs items={tabItems} />
		</div>
	);
};

export default ComponentConfigPanel;
