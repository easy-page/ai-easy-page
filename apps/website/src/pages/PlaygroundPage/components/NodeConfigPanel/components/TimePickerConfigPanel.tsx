import React, { FC } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { TimePickerPropsSchema } from '../../../Schema/componentProps';

const { Option } = Select;

interface TimePickerConfigPanelProps {
	props: TimePickerPropsSchema['properties'];
	onChange: (props: TimePickerPropsSchema['properties']) => void;
}

const TimePickerConfigPanel: FC<TimePickerConfigPanelProps> = ({
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

			<Form.Item label="时间格式" name="format">
				<Select>
					<Option value="HH:mm:ss">HH:mm:ss</Option>
					<Option value="HH:mm">HH:mm</Option>
					<Option value="HH:mm:ss.SSS">HH:mm:ss.SSS</Option>
				</Select>
			</Form.Item>

			<Form.Item label="显示现在按钮" name="showNow" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="允许清除" name="allowClear" valuePropName="checked">
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

export default TimePickerConfigPanel;
