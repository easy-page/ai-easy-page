import React, { FC } from 'react';
import { Form, Input, Switch } from 'antd';
import { IframePropsSchema } from '../../../Schema/componentSchemas/native';
import BasePropsConfigPanel from './shared/BasePropsConfigPanel';

interface IframeConfigPanelProps {
	props: IframePropsSchema['properties'];
	onChange: (props: IframePropsSchema['properties']) => void;
	componentIndex?: number;
}

const IframeConfigPanel: FC<IframeConfigPanelProps> = ({ props, onChange }) => {
	const [form] = Form.useForm();

	const handleValuesChange = (_: any, allValues: any) => {
		onChange(allValues as IframePropsSchema['properties']);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<BasePropsConfigPanel />

			<Form.Item label="src" name="src">
				<Input placeholder="https://..." />
			</Form.Item>
			<Form.Item label="宽度 width" name="width">
				<Input placeholder="例如：100% 或 800" />
			</Form.Item>
			<Form.Item label="高度 height" name="height">
				<Input placeholder="例如：100% 或 600" />
			</Form.Item>
			<Form.Item label="allow" name="allow">
				<Input placeholder="camera; microphone; clipboard-write;..." />
			</Form.Item>
			<Form.Item label="sandbox" name="sandbox">
				<Input placeholder="allow-scripts allow-same-origin ..." />
			</Form.Item>
			<Form.Item
				label="允许全屏"
				name="allowFullScreen"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>
		</Form>
	);
};

export default IframeConfigPanel;
