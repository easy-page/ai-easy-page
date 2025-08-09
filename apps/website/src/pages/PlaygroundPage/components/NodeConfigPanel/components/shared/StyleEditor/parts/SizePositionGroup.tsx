import React from 'react';
import { Collapse, Form, Row, Col, Input, Typography } from 'antd';

const { Text } = Typography;

export const SizePositionGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={8}>
				<Col span={12}>
					<Form.Item label="X">
						<Input
							value={value.left as any}
							onChange={(e) => onChange({ left: e.target.value })}
							placeholder="如 102px 或 10%"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="Y">
						<Input
							value={value.top as any}
							onChange={(e) => onChange({ top: e.target.value })}
							placeholder="如 64px 或 10%"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="W 宽度">
						<Input
							value={value.width as any}
							onChange={(e) => onChange({ width: e.target.value })}
							placeholder="100% 或 300px"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="H 高度">
						<Input
							value={value.height as any}
							onChange={(e) => onChange({ height: e.target.value })}
							placeholder="100% 或 300px"
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
