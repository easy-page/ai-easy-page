import React, { FC } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { APropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

const { Option } = Select;

interface AConfigPanelProps {
	props: APropsSchema['properties'];
	onChange: (props: APropsSchema['properties']) => void;
	componentIndex?: number;
}

const AConfigPanel: FC<AConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as APropsSchema['properties']);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<BasePropsConfigPanel />

			<Form.Item label="链接地址 href" name="href">
				<Input placeholder="https://..." />
			</Form.Item>
			<Form.Item label="target" name="target">
				<Select allowClear>
					<Option value="_self">_self</Option>
					<Option value="_blank">_blank</Option>
					<Option value="_parent">_parent</Option>
					<Option value="_top">_top</Option>
				</Select>
			</Form.Item>
			<Form.Item label="rel" name="rel">
				<Input placeholder="noopener noreferrer" />
			</Form.Item>
		</Form>
	);
};

export default AConfigPanel;
