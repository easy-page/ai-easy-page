import React, { FC, useMemo } from 'react';
import { Card, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ComponentTypeOption } from '../data/componentOptions';
import {
	getComponentExample,
	isFormComponent,
} from '@/pages/PlaygroundPage/PreviewExamples';

interface ComponentPreviewProps {
	selectedComponent: ComponentTypeOption | null;
	isFormComponent?: boolean;
}

const ComponentPreview: FC<ComponentPreviewProps> = ({
	selectedComponent,
	isFormComponent = true,
}) => {
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

		const ComponentExample = getComponentExample(selectedComponent.value);
		if (!ComponentExample) {
			return (
				<div className="preview-error">
					<Empty
						image={<EyeOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />}
						description={`组件 ${selectedComponent.label} 暂不支持预览`}
					/>
				</div>
			);
		}

		return (
			<div className="preview-content">
				<ComponentExample isFormComponent={isFormComponent} />
			</div>
		);
	}, [selectedComponent, isFormComponent]);

	return (
		<Card className="component-preview" title="组件预览">
			{renderPreview}
		</Card>
	);
};

export default ComponentPreview;
