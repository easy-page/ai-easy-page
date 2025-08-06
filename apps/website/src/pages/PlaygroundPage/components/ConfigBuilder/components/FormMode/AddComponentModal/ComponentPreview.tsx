import React, { FC, useMemo } from 'react';
import { Card, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ComponentTypeOption } from '../data/componentOptions';
import { ComponentType } from '../types/componentTypes';
import { Form, FormItem } from '@easy-page/core';
import { EASY_PAGE_CORE_COMPONENT_MAP } from '../../../../../utils/componentMaps';

interface ComponentPreviewProps {
	selectedComponent: ComponentTypeOption | null;
}

// 使用统一的组件映射表
const COMPONENT_MAP = EASY_PAGE_CORE_COMPONENT_MAP;

const ComponentPreview: FC<ComponentPreviewProps> = ({ selectedComponent }) => {
	const renderPreview = useMemo(() => {
		if (!selectedComponent) {
			return (
				<div className="preview-placeholder">
					<Empty
						image={<EyeOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
						description="请选择组件查看预览"
					/>
				</div>
			);
		}

		const Component = COMPONENT_MAP[selectedComponent.value];
		if (!Component) {
			return (
				<div className="preview-error">
					<Empty
						image={<EyeOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />}
						description={`组件 ${selectedComponent.label} 暂不支持预览`}
					/>
				</div>
			);
		}

		// 根据组件类型生成预览内容
		const getPreviewProps = () => {
			switch (selectedComponent.value) {
				case 'Input':
					return { placeholder: '请输入内容' };
				case 'Select':
					return {
						placeholder: '请选择',
						options: [
							{ label: '选项1', value: '1' },
							{ label: '选项2', value: '2' },
							{ label: '选项3', value: '3' },
						],
					};
				case 'Checkbox':
					return { children: '复选框' };
				case 'CheckboxGroup':
					return {
						options: [
							{ label: '选项1', value: '1' },
							{ label: '选项2', value: '2' },
							{ label: '选项3', value: '3' },
						],
					};
				case 'Radio':
					return { children: '单选框' };
				case 'RadioGroup':
					return {
						options: [
							{ label: '选项1', value: '1' },
							{ label: '选项2', value: '2' },
							{ label: '选项3', value: '3' },
						],
					};
				case 'TextArea':
					return { placeholder: '请输入多行文本', rows: 3 };
				case 'DatePicker':
					return { placeholder: '请选择日期' };
				case 'DateRangePicker':
					return { placeholder: ['开始日期', '结束日期'] };
				case 'TimePicker':
					return { placeholder: '请选择时间' };
				case 'Container':
					return {
						children: (
							<div
								style={{
									padding: '16px',
									background: '#f5f5f5',
									borderRadius: '4px',
								}}
							>
								容器内容
							</div>
						),
					};
				case 'DynamicForm':
					return {
						children: (
							<div
								style={{
									padding: '16px',
									background: '#f5f5f5',
									borderRadius: '4px',
								}}
							>
								动态表单内容
							</div>
						),
					};
				default:
					return {};
			}
		};

		const previewProps = getPreviewProps();

		return (
			<div className="preview-content">
				<div className="preview-header">
					<h4>{selectedComponent.label} 预览</h4>
					<p>{selectedComponent.description}</p>
				</div>
				<div className="preview-form">
					<Form>
						<FormItem id="preview" label="预览">
							<Component {...previewProps} />
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}, [selectedComponent]);

	return (
		<Card className="component-preview" title="组件预览">
			{renderPreview}
		</Card>
	);
};

export default ComponentPreview;
