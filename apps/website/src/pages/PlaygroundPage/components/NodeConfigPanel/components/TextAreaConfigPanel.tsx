import React, { FC } from 'react';
import { Form, Input, Switch, InputNumber } from 'antd';
import { TextAreaPropsSchema } from '../../../Schema/componentProps';

interface TextAreaConfigPanelProps {
	props: TextAreaPropsSchema['properties'];
	onChange: (props: TextAreaPropsSchema['properties']) => void;
}

const TextAreaConfigPanel: FC<TextAreaConfigPanelProps> = ({
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
			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="行数" name="rows">
				<InputNumber min={1} max={20} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="最大长度" name="maxLength">
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="显示字符计数" name="showCount" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="自动调整大小" name="autoSize" valuePropName="checked">
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

export default TextAreaConfigPanel;
