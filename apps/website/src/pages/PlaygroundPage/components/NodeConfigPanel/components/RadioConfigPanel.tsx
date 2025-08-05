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
