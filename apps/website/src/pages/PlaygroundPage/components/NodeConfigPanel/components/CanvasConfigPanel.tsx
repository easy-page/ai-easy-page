import React, { FC } from 'react';
import { Form, InputNumber } from 'antd';
import { CanvasPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface CanvasConfigPanelProps {
	props: CanvasPropsSchema['properties'];
	onChange: (props: CanvasPropsSchema['properties']) => void;
	componentIndex?: number;
}

const CanvasConfigPanel: FC<CanvasConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as CanvasPropsSchema['properties']);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<BasePropsConfigPanel />

			<Form.Item label="宽度 width" name="width">
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item label="高度 height" name="height">
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>
		</Form>
	);
};

export default CanvasConfigPanel;
