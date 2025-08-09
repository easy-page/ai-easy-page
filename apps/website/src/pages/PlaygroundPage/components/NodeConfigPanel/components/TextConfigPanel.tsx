import React, { FC } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { TextPropsSchema } from '../../../Schema/componentProps';

const { Option } = Select;

interface TextConfigPanelProps {
	props: TextPropsSchema['properties'];
	onChange: (props: TextPropsSchema['properties']) => void;
}

const TextConfigPanel: FC<TextConfigPanelProps> = ({ props, onChange }) => {
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
			<Form.Item label="文本" name="text">
				<Input placeholder="请输入文本" />
			</Form.Item>
		</Form>
	);
};

export default TextConfigPanel;
