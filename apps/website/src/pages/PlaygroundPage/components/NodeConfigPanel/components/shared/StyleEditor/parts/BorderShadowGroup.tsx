import React from 'react';
import { Form, Row, Col, Input, Typography } from 'antd';
const { Text } = Typography;

export const BorderShadowGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={8}>
				<Col span={12}>
					<Form.Item label="边框">
						<Input
							value={value.border as any}
							onChange={(e) => onChange({ border: e.target.value })}
							placeholder="1px solid #ddd"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="圆角">
						<Input
							value={value.borderRadius as any}
							onChange={(e) => onChange({ borderRadius: e.target.value })}
							placeholder="8px / 50%"
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item label="阴影">
						<Input
							value={value.boxShadow as any}
							onChange={(e) => onChange({ boxShadow: e.target.value })}
							placeholder="0 2px 8px rgba(0,0,0,.15)"
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
