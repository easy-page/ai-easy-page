import React, { FC } from 'react';
import { Form } from 'antd';
import { LiPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface LiConfigPanelProps {
	props: LiPropsSchema['properties'];
	onChange: (props: LiPropsSchema['properties']) => void;
	componentIndex?: number;
}

const LiConfigPanel: FC<LiConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as LiPropsSchema['properties']);
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

export default LiConfigPanel;
