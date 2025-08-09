import React from 'react';
import { Form, Row, Col, Select, InputNumber } from 'antd';
const { Option } = Select as any;

export const PositionGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={[12, 12]}>
				<Col span={12}>
					<Form.Item label="定位方式" style={{ marginBottom: 0 }}>
						<Select
							value={value.position as any}
							onChange={(v) => onChange({ position: v })}
							placeholder="选择定位"
							allowClear
						>
							<Option value="static">static</Option>
							<Option value="relative">relative</Option>
							<Option value="absolute">absolute</Option>
							<Option value="fixed">fixed</Option>
							<Option value="sticky">sticky</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="层级 zIndex" style={{ marginBottom: 0 }}>
						<InputNumber
							style={{ width: '100%' }}
							value={Number(value.zIndex ?? 0)}
							onChange={(v) => onChange({ zIndex: v ?? undefined })}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="旋转 (°)" style={{ marginBottom: 0 }}>
						<InputNumber
							style={{ width: '100%' }}
							value={Number(
								typeof value.rotate === 'number' ? value.rotate : 0
							)}
							onChange={(v) => {
								const deg = v ?? 0;
								const transform = `rotate(${deg}deg)`;
								onChange({ rotate: deg, transform });
							}}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="裁剪内容" style={{ marginBottom: 0 }}>
						<Select
							value={value.overflow as any}
							onChange={(v) => onChange({ overflow: v })}
							placeholder="overflow"
							allowClear
						>
							<Option value="visible">visible</Option>
							<Option value="hidden">hidden</Option>
							<Option value="auto">auto</Option>
							<Option value="scroll">scroll</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
