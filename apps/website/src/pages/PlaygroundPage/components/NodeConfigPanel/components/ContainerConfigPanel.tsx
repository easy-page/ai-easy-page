import React, { FC } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { ContainerPropsSchema } from '../../../Schema/componentProps';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';

interface ContainerConfigPanelProps {
	props: ContainerPropsSchema['properties'];
	onChange: (props: ContainerPropsSchema['properties']) => void;
}

const ContainerConfigPanel: FC<ContainerConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	const handleTitleChange = (content: string) => {
		const newProps = {
			...props,
			title: {
				type: 'reactNode' as const,
				content,
			},
		};
		onChange(newProps);
	};

	const handleCustomContainerChange = (content: string) => {
		const newProps = {
			...props,
			customContainer: {
				type: 'functionReactNode' as const,
				content,
			},
		};
		onChange(newProps);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<Form.Item label="标题">
				<MonacoEditor
					value={props.title?.content || ''}
					onChange={handleTitleChange}
					language="jsx"
					height="80px"
				/>
			</Form.Item>

			<Form.Item label="标题类型" name="titleType">
				<Select
					options={[
						{ label: '一级标题', value: 'h1' },
						{ label: '二级标题', value: 'h2' },
						{ label: '三级标题', value: 'h3' },
						{ label: '四级标题', value: 'h4' },
					]}
					placeholder="请选择标题类型"
				/>
			</Form.Item>

			<Form.Item label="容器类型" name="containerType">
				<Select
					options={[
						{ label: '卡片', value: 'Card' },
						{ label: '边框', value: 'Bordered' },
					]}
					placeholder="请选择容器类型"
				/>
			</Form.Item>

			<Form.Item label="布局方式" name="layout">
				<Select
					options={[
						{ label: '垂直布局', value: 'vertical' },
						{ label: '水平布局', value: 'horizontal' },
					]}
					placeholder="请选择布局方式"
				/>
			</Form.Item>

			<Form.Item label="可折叠" name="collapsible" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item
				label="默认折叠"
				name="defaultCollapsed"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>

			<Form.Item label="自定义容器">
				<MonacoEditor
					value={props.customContainer?.content || ''}
					onChange={handleCustomContainerChange}
					language="jsx"
					height="150px"
				/>
			</Form.Item>

			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch />
			</Form.Item>

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default ContainerConfigPanel;
