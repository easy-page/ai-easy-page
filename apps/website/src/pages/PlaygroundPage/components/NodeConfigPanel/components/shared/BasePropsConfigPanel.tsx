import React, { FC } from 'react';
import { Form, Input, Switch } from 'antd';
import { CommonComponentProps } from '../../../../Schema/componentSchemas/types';
import StyleEditor from './StyleEditor';

const { TextArea } = Input;

interface BasePropsConfigPanelProps {
	// 值来自各元素的 props，含 baseProps 字段
	props?: CommonComponentProps;
}

/**
 * 通用基础属性配置：placeholder / className / style / disabled
 * 使用外层的 Form 上下文，内部仅组织 Form.Item
 */
const BasePropsConfigPanel: FC<BasePropsConfigPanelProps> = () => {
	return (
		<>
			<Form.Item label="占位符" name="placeholder">
				<Input placeholder="请输入占位符文本" />
			</Form.Item>

			<Form.Item label="CSS 类名" name="className">
				<Input placeholder="class 名称" />
			</Form.Item>

			<Form.Item
				label="内联样式"
				name="style"
				tooltip="支持 JSON 与可视化两种模式切换"
			>
				<StyleEditor />
			</Form.Item>

			<Form.Item label="禁用" name="disabled" valuePropName="checked">
				<Switch />
			</Form.Item>
		</>
	);
};

export default BasePropsConfigPanel;
