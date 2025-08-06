import React, { FC } from 'react';
import { Form, Input, Select, Switch, Space, Typography } from 'antd';
import { ContainerPropsSchema } from '../../../Schema/componentProps';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';
import ReactNodeConfigPanel from './ReactNodeConfigPanel';
import { ComponentSchema } from '../../../Schema/component';

const { Option } = Select;
const { TextArea } = Input;

interface ContainerConfigPanelProps {
	props: ContainerPropsSchema['properties'];
	onChange: (props: ContainerPropsSchema['properties']) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
	componentIndex?: number; // 当前组件的索引
}

const ContainerConfigPanel: FC<ContainerConfigPanelProps> = ({
	props,
	onChange,
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
	componentIndex,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	const handleTitleChange = (value: any) => {
		const newProps = {
			...props,
			title: value,
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

	const handleEffectedByChange = (value: string) => {
		const effectedBy = value
			.split(',')
			.map((field) => field.trim())
			.filter(Boolean);
		const newProps = {
			...props,
			effectedBy,
		};
		onChange(newProps);
	};

	const handleShowChange = (content: string) => {
		const newProps = {
			...props,
			show: {
				type: 'function' as const,
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
				<ReactNodeConfigPanel
					value={props.title}
					onChange={handleTitleChange}
					label="标题内容"
					placeholder="请输入标题内容或选择组件"
					onNodeSelect={onNodeSelect}
					onExpand={onExpand}
					onUpdateParentProperty={onUpdateParentProperty}
					propertyPath="title"
					componentIndex={componentIndex}
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
					height="120px"
				/>
			</Form.Item>

			{/* WhenProps 相关配置 */}
			<Form.Item label="条件渲染">
				<Space direction="vertical" style={{ width: '100%' }}>
					<Form.Item label="影响字段" style={{ marginBottom: 8 }}>
						<Input
							value={props.effectedBy?.join(', ') || ''}
							onChange={(e) => handleEffectedByChange(e.target.value)}
							placeholder="请输入字段名，多个字段用逗号分隔"
						/>
					</Form.Item>
					<Form.Item label="显示条件" style={{ marginBottom: 8 }}>
						<MonacoEditor
							value={props.show?.content || 'return true;'}
							onChange={handleShowChange}
							language="javascript"
							height="100px"
						/>
					</Form.Item>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default ContainerConfigPanel;
