import React, { FC } from 'react';
import {
	Form,
	Input,
	InputNumber,
	Select,
	Button,
	Space,
	Checkbox,
	Divider,
} from 'antd';
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
				type: 'functionReactNode' as const,
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

	// 处理行配置相关函数
	const handleRowIndexsChange = (rowIndex: number, value: string) => {
		const currentRows = props.rows || [];
		const newRows = [...currentRows];
		if (newRows[rowIndex]) {
			newRows[rowIndex] = {
				...newRows[rowIndex],
				rowIndexs: value
					.split(',')
					.map((v) => parseInt(v.trim()))
					.filter((v) => !isNaN(v)),
			};
		}
		const newProps = {
			...props,
			rows: newRows,
		};
		onChange(newProps);
	};

	const handleRestAllChange = (rowIndex: number, checked: boolean) => {
		const currentRows = props.rows || [];
		const newRows = [...currentRows];
		if (newRows[rowIndex]) {
			newRows[rowIndex] = {
				...newRows[rowIndex],
				restAll: checked,
			};
		}
		const newProps = {
			...props,
			rows: newRows,
		};
		onChange(newProps);
	};

	const handleFieldsChange = (rowIndex: number, content: string) => {
		const currentRows = props.rows || [];
		const newRows = [...currentRows];
		if (newRows[rowIndex]) {
			newRows[rowIndex] = {
				...newRows[rowIndex],
				fields: [
					{
						type: 'reactNode' as const,
						content,
					},
				],
			};
		}
		const newProps = {
			...props,
			rows: newRows,
		};
		onChange(newProps);
	};

	const handleRowSpanChange = (rowIndex: number, value: string) => {
		const currentRows = props.rows || [];
		const newRows = [...currentRows];
		if (newRows[rowIndex]) {
			newRows[rowIndex] = {
				...newRows[rowIndex],
				rowSpan: value
					.split(',')
					.map((v) => parseInt(v.trim()))
					.filter((v) => !isNaN(v)),
			};
		}
		const newProps = {
			...props,
			rows: newRows,
		};
		onChange(newProps);
	};

	const addRow = () => {
		const currentRows = props.rows || [];
		const newRows = [
			...currentRows,
			{
				rowIndexs: [currentRows.length + 1],
				restAll: false,
				fields: [
					{
						type: 'reactNode' as const,
						content: `<FormItem id="field${
							currentRows.length + 1
						}" label="字段${
							currentRows.length + 1
						}" required={false}><Input id="field${
							currentRows.length + 1
						}" placeholder="请输入内容" /></FormItem>`,
					},
				],
				rowSpan: [1],
			},
		];
		const newProps = {
			...props,
			rows: newRows,
		};
		onChange(newProps);
	};

	const removeRow = (index: number) => {
		const currentRows = props.rows || [];
		const newRows = currentRows.filter((_, i) => i !== index);
		const newProps = {
			...props,
			rows: newRows,
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

			<Divider>行配置</Divider>

			<Form.Item label="行配置">
				<Space direction="vertical" style={{ width: '100%' }}>
					{(props.rows || []).map((row, index) => (
						<div
							key={index}
							style={{
								border: '1px solid #d9d9d9',
								padding: '12px',
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
								<span>行 {index + 1}</span>
								<Button size="small" danger onClick={() => removeRow(index)}>
									删除
								</Button>
							</Space>

							<Form.Item label="行索引" style={{ marginBottom: '8px' }}>
								<Input
									placeholder="请输入行索引，如: 1,2,3"
									value={row.rowIndexs?.join(',') || ''}
									onChange={(e) => handleRowIndexsChange(index, e.target.value)}
								/>
							</Form.Item>

							<Form.Item label="包含剩余所有行" style={{ marginBottom: '8px' }}>
								<Checkbox
									checked={row.restAll || false}
									onChange={(e) => handleRestAllChange(index, e.target.checked)}
								>
									包含剩余所有行
								</Checkbox>
							</Form.Item>

							<Form.Item label="行跨度" style={{ marginBottom: '8px' }}>
								<Input
									placeholder="请输入行跨度，如: 1,2,1"
									value={row.rowSpan?.join(',') || ''}
									onChange={(e) => handleRowSpanChange(index, e.target.value)}
								/>
							</Form.Item>

							<Form.Item label="字段配置" style={{ marginBottom: '8px' }}>
								<MonacoEditor
									value={row.fields?.[0]?.content || ''}
									onChange={(value) => handleFieldsChange(index, value || '')}
									language="jsx"
									height="120px"
								/>
							</Form.Item>
						</div>
					))}
					<Button type="dashed" onClick={addRow} block>
						添加行配置
					</Button>
				</Space>
			</Form.Item>

			<Form.Item label="自定义容器">
				<MonacoEditor
					value={props.customContainer?.content || ''}
					onChange={handleCustomContainerChange}
					language="jsx"
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
