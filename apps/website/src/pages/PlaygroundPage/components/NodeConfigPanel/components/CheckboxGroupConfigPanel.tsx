import React, { FC } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CheckboxGroupPropsSchema } from '../../../Schema/componentProps';

interface CheckboxGroupConfigPanelProps {
	props: CheckboxGroupPropsSchema['properties'];
	onChange: (props: CheckboxGroupPropsSchema['properties']) => void;
}

const CheckboxGroupConfigPanel: FC<CheckboxGroupConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	const handleAddOption = () => {
		const currentOptions = form.getFieldValue('options') || [];
		const newOptions = [
			...currentOptions,
			{ label: '新选项', value: 'new_value' },
		];
		form.setFieldValue('options', newOptions);
		handleValuesChange({}, { ...form.getFieldsValue(), options: newOptions });
	};

	const handleRemoveOption = (index: number) => {
		const currentOptions = form.getFieldValue('options') || [];
		const newOptions = currentOptions.filter(
			(_: any, i: number) => i !== index
		);
		form.setFieldValue('options', newOptions);
		handleValuesChange({}, { ...form.getFieldsValue(), options: newOptions });
	};

	const handleOptionChange = (
		index: number,
		field: 'label' | 'value',
		value: string
	) => {
		const currentOptions = form.getFieldValue('options') || [];
		const newOptions = [...currentOptions];
		newOptions[index] = { ...newOptions[index], [field]: value };
		form.setFieldValue('options', newOptions);
		handleValuesChange({}, { ...form.getFieldsValue(), options: newOptions });
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={props}
			onValuesChange={handleValuesChange}
		>
			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="选项列表">
				<Space direction="vertical" style={{ width: '100%' }}>
					{(props.options || []).map((option: any, index: number) => (
						<Space key={index}>
							<Input
								placeholder="标签"
								value={option.label}
								onChange={(e) =>
									handleOptionChange(index, 'label', e.target.value)
								}
								style={{ width: 120 }}
							/>
							<Input
								placeholder="值"
								value={option.value}
								onChange={(e) =>
									handleOptionChange(index, 'value', e.target.value)
								}
								style={{ width: 120 }}
							/>
							<Button
								type="text"
								icon={<DeleteOutlined />}
								onClick={() => handleRemoveOption(index)}
								danger
							/>
						</Space>
					))}
					<Button
						type="dashed"
						icon={<PlusOutlined />}
						onClick={handleAddOption}
						block
					>
						添加选项
					</Button>
				</Space>
			</Form.Item>

			<Form.Item label="CSS类名" name="className">
				<Input placeholder="请输入CSS类名" />
			</Form.Item>
		</Form>
	);
};

export default CheckboxGroupConfigPanel;
