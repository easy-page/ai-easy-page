import React, { FC } from 'react';
import { Switch, Space } from 'antd';
import { ComponentTypeOption } from '../data/componentOptions';
import { getComponentConfig } from '../ComponentConfig';

interface ComponentConfigPanelProps {
	component: ComponentTypeOption;
	isFormComponent: boolean;
	onFormComponentChange: (value: boolean) => void;
}

const ComponentConfigPanel: FC<ComponentConfigPanelProps> = ({
	component,
	isFormComponent,
	onFormComponentChange,
}) => {
	const config = getComponentConfig(component.value);

	return (
		<div className="component-config-panel">
			<div className="config-header">
				<div className="component-icon">{component.icon}</div>
				<div className="component-info">
					<div className="component-name">{component.label}</div>
					<div className="component-description">{component.description}</div>
				</div>
			</div>

			<div className="config-content">
				<div className="config-item">
					<div>
						<div className="config-label">是否为表单组件</div>
						{config && !config.canUseFormItem && (
							<div className="config-note">
								{config.note || '此组件不能使用FormItem包裹'}
							</div>
						)}
					</div>
					<Space>
						<Switch
							checked={isFormComponent}
							onChange={onFormComponentChange}
							disabled={config ? !config.canUseFormItem : false}
						/>
						<span>{isFormComponent ? '是' : '否'}</span>
					</Space>
				</div>

				{isFormComponent && (
					<div
						style={{
							fontSize: '12px',
							color: '#52c41a',
							marginTop: '8px',
							padding: '8px',
							backgroundColor: '#f6ffed',
							borderRadius: '4px',
							border: '1px solid #b7eb8f',
						}}
					>
						表单组件会被包裹在FormItem中，支持表单验证和标签显示
					</div>
				)}

				{!isFormComponent && config?.canUseFormItem && (
					<div
						style={{
							fontSize: '12px',
							color: '#666',
							marginTop: '8px',
							padding: '8px',
							backgroundColor: '#fafafa',
							borderRadius: '4px',
							border: '1px solid #d9d9d9',
						}}
					>
						非表单组件直接渲染，不包含表单相关的功能
					</div>
				)}
			</div>
		</div>
	);
};

export default ComponentConfigPanel;
