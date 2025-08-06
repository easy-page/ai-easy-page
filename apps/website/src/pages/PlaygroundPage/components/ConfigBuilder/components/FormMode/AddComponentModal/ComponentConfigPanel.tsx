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
					<div className="form-component-note">
						表单组件会被包裹在FormItem中，支持表单验证和标签显示
					</div>
				)}

				{!isFormComponent && config?.canUseFormItem && (
					<div className="non-form-component-note">
						非表单组件直接渲染，不包含表单相关的功能
					</div>
				)}
			</div>
		</div>
	);
};

export default ComponentConfigPanel;
