import React, { FC } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { DateRangePickerPropsSchema } from '../../../Schema/componentProps';

const { Option } = Select;

interface DateRangePickerConfigPanelProps {
	props: DateRangePickerPropsSchema['properties'];
	onChange: (props: DateRangePickerPropsSchema['properties']) => void;
}

const DateRangePickerConfigPanel: FC<DateRangePickerConfigPanelProps> = ({
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

			<Form.Item label="日期格式" name="format">
				<Select>
					<Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
					<Option value="YYYY/MM/DD">YYYY/MM/DD</Option>
					<Option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</Option>
					<Option value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</Option>
				</Select>
			</Form.Item>

			<Form.Item label="显示时间" name="showTime" valuePropName="checked">
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

export default DateRangePickerConfigPanel;
