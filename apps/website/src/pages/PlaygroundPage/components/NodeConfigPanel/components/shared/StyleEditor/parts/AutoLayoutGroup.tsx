import React from 'react';
import {
	Collapse,
	Form,
	Row,
	Col,
	Typography,
	Switch,
	Segmented,
	InputNumber,
} from 'antd';
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const AutoLayoutGroup: React.FC<{
	value: Record<string, any>;
	onChange: (partial: Record<string, any>) => void;
}> = ({ value, onChange }) => {
	const isFlex = (value.display || '').toString() === 'flex';

	return (
		<div>
			<Row gutter={8}>
				<Col span={12}>
					<Form.Item label="启用">
						<Switch
							checked={isFlex}
							onChange={(checked) =>
								onChange({ display: checked ? 'flex' : 'block' })
							}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="换行">
						<Segmented
							value={value.flexWrap || 'nowrap'}
							onChange={(v) => onChange({ flexWrap: v })}
							options={[
								{ label: '不换', value: 'nowrap' },
								{ label: '换行', value: 'wrap' },
							]}
						/>
					</Form.Item>
				</Col>
			</Row>

			{isFlex && (
				<>
					<Row gutter={8}>
						<Col span={12}>
							<Form.Item label="方向">
								<Segmented
									value={value.flexDirection || 'row'}
									onChange={(v) => onChange({ flexDirection: v })}
									options={[
										{
											label: (
												<span>
													<ArrowRightOutlined /> 水平
												</span>
											),
											value: 'row',
										},
										{
											label: (
												<span>
													<ArrowDownOutlined /> 垂直
												</span>
											),
											value: 'column',
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="间距">
								<InputNumber
									min={0}
									style={{ width: '100%' }}
									addonAfter="px"
									value={Number(value.gap || 0)}
									onChange={(v) => onChange({ gap: v ?? 0 })}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={8}>
						<Col span={12}>
							<Form.Item label="主轴对齐">
								<Segmented
									value={value.justifyContent || 'flex-start'}
									onChange={(v) => onChange({ justifyContent: v })}
									options={[
										{ label: '左', value: 'flex-start' },
										{ label: '居中', value: 'center' },
										{ label: '右', value: 'flex-end' },
										{ label: '两端', value: 'space-between' },
										{ label: '平均', value: 'space-around' },
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="交叉轴对齐">
								<Segmented
									value={value.alignItems || 'stretch'}
									onChange={(v) => onChange({ alignItems: v })}
									options={[
										{ label: '顶部', value: 'flex-start' },
										{ label: '中间', value: 'center' },
										{ label: '底部', value: 'flex-end' },
										{ label: '拉伸', value: 'stretch' },
									]}
								/>
							</Form.Item>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
};
