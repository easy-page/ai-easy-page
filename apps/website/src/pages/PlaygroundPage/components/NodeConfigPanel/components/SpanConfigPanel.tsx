import React, { FC } from 'react';
import { Form } from 'antd';
import { SpanPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface SpanConfigPanelProps {
	props: SpanPropsSchema['properties'];
	onChange: (props: SpanPropsSchema['properties']) => void;
	componentIndex?: number;
}

const SpanConfigPanel: FC<SpanConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as SpanPropsSchema['properties']);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<BasePropsConfigPanel />
		</Form>
	);
};

export default SpanConfigPanel;
