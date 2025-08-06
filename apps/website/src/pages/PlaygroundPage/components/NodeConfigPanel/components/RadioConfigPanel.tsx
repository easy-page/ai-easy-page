import React, { FC } from 'react';
import { Form, Input, Switch } from 'antd';
import { RadioPropsSchema } from '../../../Schema/componentProps';

interface RadioConfigPanelProps {
	props: RadioPropsSchema['properties'];
	onChange: (props: RadioPropsSchema['properties']) => void;
}

const RadioConfigPanel: FC<RadioConfigPanelProps> = ({ props, onChange }) => {
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
			<Form.Item label="标签文本" name="label">
				<Input placeholder="请输入标签文本" />
			</Form.Item>

			<Form.Item label="选项值" name="value">
				<Input placeholder="请输入选项值" />
			</Form.Item>

			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default RadioConfigPanel;
