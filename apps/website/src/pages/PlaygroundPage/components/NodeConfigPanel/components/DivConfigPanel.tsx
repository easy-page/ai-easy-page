import React, { FC } from 'react';
import { Form } from 'antd';
import { DivPropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface DivConfigPanelProps {
	props: DivPropsSchema['properties'];
	onChange: (props: DivPropsSchema['properties']) => void;
	componentIndex?: number;
}

const DivConfigPanel: FC<DivConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as DivPropsSchema['properties']);
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

export default DivConfigPanel;
