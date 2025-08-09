import React from 'react';
import { Form, Row, Col, Input, Typography, ColorPicker, Slider } from 'antd';
const { Text } = Typography;

export const FillGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={8}>
				<Col span={24}>
					<Form.Item label="背景色">
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<ColorPicker
								value={value.backgroundColor as any}
								onChange={(_, hex) => onChange({ backgroundColor: hex })}
							/>
							<Input
								value={value.backgroundColor as any}
								onChange={(e) => onChange({ backgroundColor: e.target.value })}
								placeholder="#fff / transparent"
							/>
						</div>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item label="透明度">
						<Slider
							min={0}
							max={1}
							step={0.01}
							value={Number(value.opacity ?? 1)}
							onChange={(v) => onChange({ opacity: v })}
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
