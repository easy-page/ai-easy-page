import React, { FC } from 'react';
import { Form } from 'antd';
import { UlPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface UlConfigPanelProps {
	props: UlPropsSchema['properties'];
	onChange: (props: UlPropsSchema['properties']) => void;
	componentIndex?: number;
}

const UlConfigPanel: FC<UlConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as UlPropsSchema['properties']);
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

export default UlConfigPanel;
