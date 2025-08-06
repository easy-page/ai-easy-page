import React, { FC } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { FunctionReactNodeProperty } from '../../../Schema/specialProperties';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';

const { Title } = Typography;

interface FunctionReactNodePropertyConfigPanelProps {
	value?: FunctionReactNodeProperty;
	onChange?: (value: FunctionReactNodeProperty) => void;
	label?: string;
	placeholder?: string;
}

const FunctionReactNodePropertyConfigPanel: FC<
	FunctionReactNodePropertyConfigPanelProps
> = ({
	value,
	onChange,
	label = '函数组件配置',
	placeholder = '请输入返回React组件的函数代码',
}) => {
	const handleCodeChange = (content: string) => {
		onChange?.({
			type: 'functionReactNode',
			content,
		});
	};

	const handleAIAssist = () => {
		// TODO: 实现AI编辑功能
		console.log('AI编辑功能待实现');
	};

	return (
		<Card size="small" style={{ marginBottom: 16 }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 8,
				}}
			>
				<Title level={5} style={{ margin: 0 }}>
					{label}
				</Title>
				<Space>
					<Button
						type="primary"
						icon={<RobotOutlined />}
						size="small"
						onClick={handleAIAssist}
					>
						AI编辑
					</Button>
				</Space>
			</div>

			<MonacoEditor
				value={value?.content || ''}
				onChange={handleCodeChange}
				language="javascript"
				height="200px"
				placeholder={placeholder}
			/>
		</Card>
	);
};

export default FunctionReactNodePropertyConfigPanel;
