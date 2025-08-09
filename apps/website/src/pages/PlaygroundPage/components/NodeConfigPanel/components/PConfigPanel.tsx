import React, { FC } from 'react';
import { Form } from 'antd';
import { PPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface PConfigPanelProps {
	props: PPropsSchema['properties'];
	onChange: (props: PPropsSchema['properties']) => void;
	componentIndex?: number;
}

const PConfigPanel: FC<PConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as PPropsSchema['properties']);
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

export default PConfigPanel;
