import React, { FC } from 'react';
import { Form, Input, Switch, Select, InputNumber } from 'antd';
import { InputPropsSchema } from '../../../Schema/componentProps';

const { Option } = Select;

interface InputConfigPanelProps {
	props: InputPropsSchema['properties'];
	onChange: (props: InputPropsSchema['properties']) => void;
}

const InputConfigPanel: FC<InputConfigPanelProps> = ({ props, onChange }) => {
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

			<Form.Item label="输入类型" name="type">
				<Select>
					<Option value="text">文本</Option>
					<Option value="password">密码</Option>
					<Option value="number">数字</Option>
					<Option value="email">邮箱</Option>
					<Option value="url">网址</Option>
				</Select>
			</Form.Item>

			<Form.Item label="最大长度" name="maxLength">
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="显示字符计数" name="showCount" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="允许清除" name="allowClear" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="前缀" name="prefix">
				<Input placeholder="请输入前缀" />
			</Form.Item>

			<Form.Item label="后缀" name="suffix">
				<Input placeholder="请输入后缀" />
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

export default InputConfigPanel;
