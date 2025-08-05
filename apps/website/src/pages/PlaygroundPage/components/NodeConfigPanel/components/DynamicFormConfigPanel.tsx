import React, { FC } from 'react';
import { Form, Input } from 'antd';
import { DynamicFormPropsSchema } from '../../../Schema/componentProps';

interface DynamicFormConfigPanelProps {
	props: DynamicFormPropsSchema['properties'];
	onChange: (props: DynamicFormPropsSchema['properties']) => void;
}

const DynamicFormConfigPanel: FC<DynamicFormConfigPanelProps> = ({
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

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default DynamicFormConfigPanel;
