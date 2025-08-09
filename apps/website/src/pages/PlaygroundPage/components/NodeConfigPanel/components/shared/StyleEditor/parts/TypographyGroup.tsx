import React from 'react';
import {
	Form,
	Row,
	Col,
	Select,
	InputNumber,
	Typography,
	Input,
	ColorPicker,
} from 'antd';

const { Text } = Typography;
const { Option } = Select as any;

export const TypographyGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={[12, 12]}>
				<Col span={8}>
					<Form.Item label="字号" style={{ marginBottom: 0 }}>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
							value={Number(value.fontSize) as any}
							onChange={(v) => onChange({ fontSize: v ?? undefined })}
						/>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="对齐" style={{ marginBottom: 0 }}>
						<Select
							value={value.textAlign as any}
							onChange={(v) => onChange({ textAlign: v })}
							placeholder="选择对齐"
							allowClear
						>
							<Option value="left">left</Option>
							<Option value="center">center</Option>
							<Option value="right">right</Option>
							<Option value="justify">justify</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="文字颜色" style={{ marginBottom: 0 }}>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<ColorPicker
								value={value.color as any}
								onChange={(_, hex) => onChange({ color: hex })}
							/>
							<Input
								value={value.color as any}
								onChange={(e) => onChange({ color: e.target.value })}
								placeholder="#333 / rgb(...)"
							/>
						</div>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
