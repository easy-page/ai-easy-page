import React, { FC, useMemo } from 'react';
import { Form, Input, InputNumber, Switch, Select } from 'antd';

interface HtmlElementConfigPanelProps {
	props: Record<string, any>;
	onChange: (props: Record<string, any>) => void;
	componentIndex?: number;
	elementType?: string;
}

const { TextArea } = Input;
const { Option } = Select;

const HtmlElementConfigPanel: FC<HtmlElementConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const elementType = useMemo(
		() => (props.__componentType as string | undefined) || undefined,
		[props.__componentType]
	);

	const handleValuesChange = (changedValues: any, allValues: any) => {
		// 将 style 字符串转回对象
		const next: Record<string, any> = { ...allValues };
		if (typeof next.style === 'string' && next.style.trim()) {
			try {
				next.style = JSON.parse(next.style);
			} catch {
				// 保留原字符串，避免中断
			}
		}
		onChange(next);
	};

	// 将对象 style 序列化为字符串用于编辑
	const initialValues = useMemo(() => {
		const styleValue =
			props?.style && typeof props.style === 'object'
				? JSON.stringify(props.style, null, 2)
				: props?.style;
		return { ...props, style: styleValue };
	}, [props]);

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={initialValues}
			onValuesChange={handleValuesChange}
		>
			<Form.Item label="ID" name="id">
				<Input placeholder="请输入ID" />
			</Form.Item>

			<Form.Item label="CSS 类名" name="className">
				<Input placeholder="class 名称" />
			</Form.Item>

			<Form.Item label="内联样式(JSON)" name="style">
				<TextArea rows={4} placeholder='例如：{"color":"red"}' />
			</Form.Item>

			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch />
			</Form.Item>

			{/* 通用 children 文本（仅对文本型元素方便编辑）*/}
			{['div', 'span', 'p', 'li', 'a'].includes(elementType || '') && (
				<Form.Item label="内容文本" name="children">
					<Input placeholder="元素内部文本" />
				</Form.Item>
			)}

			{/* 特定元素属性 */}
			{elementType === 'a' && (
				<>
					<Form.Item label="链接地址 href" name="href">
						<Input placeholder="https://..." />
					</Form.Item>
					<Form.Item label="target" name="target">
						<Select allowClear>
							<Option value="_self">_self</Option>
							<Option value="_blank">_blank</Option>
							<Option value="_parent">_parent</Option>
							<Option value="_top">_top</Option>
						</Select>
					</Form.Item>
					<Form.Item label="rel" name="rel">
						<Input placeholder="noopener noreferrer" />
					</Form.Item>
				</>
			)}

			{elementType === 'canvas' && (
				<>
					<Form.Item label="宽度 width" name="width">
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label="高度 height" name="height">
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</>
			)}

			{elementType === 'iframe' && (
				<>
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
				</>
			)}
		</Form>
	);
};

export default HtmlElementConfigPanel;
