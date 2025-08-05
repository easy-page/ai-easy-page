import React, { FC } from 'react';
import { Form, Button, Space, message, Input, Switch } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { CustomPropsSchema } from '../../../Schema/componentProps';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';

interface CustomConfigPanelProps {
	props: CustomPropsSchema['properties'];
	onChange: (props: CustomPropsSchema['properties']) => void;
}

const CustomConfigPanel: FC<CustomConfigPanelProps> = ({ props, onChange }) => {
	const handleContentChange = (content: string) => {
		onChange({ ...props, content });
	};

	const handleComponentNameChange = (componentName: string) => {
		onChange({ ...props, componentName });
	};

	const handleComponentIdChange = (componentId: string) => {
		onChange({ ...props, componentId });
	};

	const handleDescriptionChange = (description: string) => {
		onChange({ ...props, description });
	};

	const handleAIEdit = () => {
		message.info('AI 编辑功能暂未实现，敬请期待...');
	};

	return (
		<Form layout="vertical">
			<Form.Item label="组件名">
				<Input
					value={props.componentName || ''}
					onChange={(e) => handleComponentNameChange(e.target.value)}
					placeholder="请输入组件名称"
				/>
			</Form.Item>

			<Form.Item label="组件 ID">
				<Input
					value={props.componentId || ''}
					onChange={(e) => handleComponentIdChange(e.target.value)}
					placeholder="请输入组件唯一标识符"
				/>
			</Form.Item>

			<Form.Item label="组件功能描述">
				<Input.TextArea
					value={props.description || ''}
					onChange={(e) => handleDescriptionChange(e.target.value)}
					placeholder="请描述组件的功能用途"
					rows={3}
				/>
			</Form.Item>

			<Form.Item label="组件内容">
				<Space direction="vertical" style={{ width: '100%' }}>
					<MonacoEditor
						value={props.content || ''}
						language="javascript"
						height="200px"
						onChange={handleContentChange}
					/>
					<Button
						type="text"
						size="small"
						icon={<RobotOutlined />}
						onClick={handleAIEdit}
					>
						AI 编辑
					</Button>
				</Space>
			</Form.Item>

			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch
					checked={props.disabled}
					onChange={(checked) => onChange({ ...props, disabled: checked })}
				/>
			</Form.Item>

			<Form.Item label="CSS类名">
				<Input
					value={props.className || ''}
					onChange={(e) => onChange({ ...props, className: e.target.value })}
					placeholder="请输入CSS类名"
				/>
			</Form.Item>
		</Form>
	);
};

export default CustomConfigPanel;
