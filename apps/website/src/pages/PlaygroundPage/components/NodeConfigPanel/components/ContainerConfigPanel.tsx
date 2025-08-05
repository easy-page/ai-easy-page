import React, { FC } from 'react';
import { Form, Input, Switch } from 'antd';
import { ContainerPropsSchema } from '../../../Schema/componentProps';

interface ContainerConfigPanelProps {
	props: ContainerPropsSchema['properties'];
	onChange: (props: ContainerPropsSchema['properties']) => void;
}

const ContainerConfigPanel: FC<ContainerConfigPanelProps> = ({
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
			<Form.Item label="标题" name="title">
				<Input placeholder="请输入容器标题" />
			</Form.Item>

			<Form.Item label="可折叠" name="collapsible" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item
				label="默认折叠"
				name="defaultCollapsed"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>

			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default ContainerConfigPanel;
