import React from 'react';
import { Form, Row, Col, Input, Typography } from 'antd';
const { Text } = Typography;

export const SpacingGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={8}>
				<Col span={12}>
					<Form.Item label="内边距">
						<Input
							value={value.padding as any}
							onChange={(e) => onChange({ padding: e.target.value })}
							placeholder="8px 12px"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="外边距">
						<Input
							value={value.margin as any}
							onChange={(e) => onChange({ margin: e.target.value })}
							placeholder="8px auto"
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
