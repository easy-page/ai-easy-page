import React from 'react';
import { Form, Row, Col, Typography, Segmented } from 'antd';
import {
	AlignLeftOutlined,
	AlignCenterOutlined,
	AlignRightOutlined,
	ColumnHeightOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export const AlignmentGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	return (
		<div>
			<Row gutter={[12, 12]}>
				<Col span={12}>
					<Form.Item label="水平" style={{ marginBottom: 0 }}>
						<Segmented
							value={value.textAlign || 'left'}
							onChange={(v) => onChange({ textAlign: v })}
							options={[
								{ label: <AlignLeftOutlined />, value: 'left' },
								{ label: <AlignCenterOutlined />, value: 'center' },
								{ label: <AlignRightOutlined />, value: 'right' },
								{ label: '两端', value: 'justify' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="垂直" style={{ marginBottom: 0 }}>
						<Segmented
							value={value.verticalAlign || 'baseline'}
							onChange={(v) => onChange({ verticalAlign: v })}
							options={[
								{ label: '顶部', value: 'top' },
								{ label: '中部', value: 'middle' },
								{ label: '底部', value: 'bottom' },
								{ label: <ColumnHeightOutlined />, value: 'baseline' },
							]}
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};
