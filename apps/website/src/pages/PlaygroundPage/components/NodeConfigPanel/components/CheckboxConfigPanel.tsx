import React, { FC } from 'react';
import { Form, Input, Switch } from 'antd';
import { CheckboxPropsSchema } from '../../../Schema/componentProps';

interface CheckboxConfigPanelProps {
	props: CheckboxPropsSchema['properties'];
	onChange: (props: CheckboxPropsSchema['properties']) => void;
}

const CheckboxConfigPanel: FC<CheckboxConfigPanelProps> = ({
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
			<Form.Item label="标签文本" name="label">
				<Input placeholder="请输入标签文本" />
			</Form.Item>

			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="半选状态" name="indeterminate" valuePropName="checked">
				<Switch />
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

export default CheckboxConfigPanel;
