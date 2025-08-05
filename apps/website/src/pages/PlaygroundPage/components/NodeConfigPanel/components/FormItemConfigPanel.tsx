import React, { FC } from 'react';
import { Form, Input, Switch, Select, InputNumber } from 'antd';
import { FormItemProps } from '../../../Schema/formItem';

const { Option } = Select;
const { TextArea } = Input;

interface FormItemConfigPanelProps {
	props: FormItemProps;
	onChange: (props: FormItemProps) => void;
}

const FormItemConfigPanel: FC<FormItemConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
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

			<Form.Item label="标签宽度" name="labelWidth">
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="隐藏标签" name="noLabel" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="提示信息" name="tips">
				<Input placeholder="请输入提示信息" />
			</Form.Item>

			<Form.Item label="帮助信息" name="help">
				<TextArea rows={2} placeholder="请输入帮助信息" />
			</Form.Item>

			<Form.Item label="额外信息" name="extra">
				<TextArea rows={2} placeholder="请输入额外信息" />
			</Form.Item>
		</Form>
	);
};

export default FormItemConfigPanel;
