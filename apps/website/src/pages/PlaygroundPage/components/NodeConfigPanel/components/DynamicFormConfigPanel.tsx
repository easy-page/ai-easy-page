import React, { FC } from 'react';
import { Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { DynamicFormPropsSchema } from '../../../Schema/componentProps';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';

interface DynamicFormConfigPanelProps {
	props: DynamicFormPropsSchema['properties'];
	onChange: (props: DynamicFormPropsSchema['properties']) => void;
}

const DynamicFormConfigPanel: FC<DynamicFormConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	const handleCustomContainerChange = (content: string) => {
		const newProps = {
			...props,
			customContainer: {
				type: 'function' as const,
				content,
			},
		};
		onChange(newProps);
	};

	const handleHeadersChange = (index: number, content: string) => {
		const currentHeaders = props.headers || [];
		const newHeaders = [...currentHeaders];
		newHeaders[index] = {
			type: 'reactNode' as const,
			content,
		};
		const newProps = {
			...props,
			headers: newHeaders,
		};
		onChange(newProps);
	};

	const addHeader = () => {
		const currentHeaders = props.headers || [];
		const newHeaders = [
			...currentHeaders,
			{
				type: 'reactNode' as const,
				content: '<div>表头</div>',
			},
		];
		const newProps = {
			...props,
			headers: newHeaders,
		};
		onChange(newProps);
	};

	const removeHeader = (index: number) => {
		const currentHeaders = props.headers || [];
		const newHeaders = currentHeaders.filter((_, i) => i !== index);
		const newProps = {
			...props,
			headers: newHeaders,
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
			<Form.Item label="表单ID" name="id">
				<Input placeholder="请输入表单ID" />
			</Form.Item>

			<Form.Item label="最大行数" name="maxRow">
				<InputNumber min={1} max={100} placeholder="请输入最大行数" />
			</Form.Item>

			<Form.Item label="最小行数" name="minRow">
				<InputNumber min={1} max={100} placeholder="请输入最小行数" />
			</Form.Item>

			<Form.Item label="容器类型" name="containerType">
				<Select
					options={[
						{ label: '标签页', value: 'tab' },
						{ label: '表格', value: 'table' },
						{ label: '网格表格', value: 'grid-table' },
						{ label: '卡片', value: 'card' },
					]}
					placeholder="请选择容器类型"
				/>
			</Form.Item>

			{props.containerType === 'grid-table' && (
				<>
					<Form.Item label="网格列配置" name="gridColumns">
						<Input placeholder="请输入列配置，如: 1,2,2,1" />
					</Form.Item>

					<Form.Item label="自定义表头">
						<Space direction="vertical" style={{ width: '100%' }}>
							{(props.headers || []).map((header, index) => (
								<div
									key={index}
									style={{
										border: '1px solid #d9d9d9',
										padding: '8px',
										borderRadius: '6px',
									}}
								>
									<Space
										style={{
											width: '100%',
											justifyContent: 'space-between',
											marginBottom: '8px',
										}}
									>
										<span>表头 {index + 1}</span>
										<Button
											size="small"
											danger
											onClick={() => removeHeader(index)}
										>
											删除
										</Button>
									</Space>
									<MonacoEditor
										value={header.content}
										onChange={(value) =>
											handleHeadersChange(index, value || '')
										}
										language="jsx"
										height="100px"
									/>
								</div>
							))}
							<Button type="dashed" onClick={addHeader} block>
								添加表头
							</Button>
						</Space>
					</Form.Item>
				</>
			)}

			<Form.Item label="自定义容器">
				<MonacoEditor
					value={props.customContainer?.content || ''}
					onChange={handleCustomContainerChange}
					language="typescript"
					height="200px"
				/>
			</Form.Item>

			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default DynamicFormConfigPanel;
