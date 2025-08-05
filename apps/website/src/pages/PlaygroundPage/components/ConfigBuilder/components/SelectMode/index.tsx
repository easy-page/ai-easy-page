import { FC } from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import { FormOutlined, FileAddOutlined } from '@ant-design/icons';
import ConfigTips from '../ConfigTips';

const { Title, Text } = Typography;

interface SelectModeProps {
	onCreateForm: () => void;
	onCreatePage: () => void;
}

const SelectMode: FC<SelectModeProps> = ({ onCreateForm, onCreatePage }) => {
	return (
		<div className="config-builder">
			<div className="config-header">
				<Title level={4}>配置搭建</Title>
				<Text type="secondary">选择要创建的内容类型</Text>
			</div>

			<div className="config-options">
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					<Card
						hoverable
						className="option-card"
						onClick={onCreateForm}
						style={{ cursor: 'pointer' }}
					>
						<div className="option-content">
							<FormOutlined className="option-icon" />
							<div className="option-text">
								<Title level={5}>创建表单</Title>
								<Text type="secondary">创建一个基础表单结构</Text>
							</div>
						</div>
					</Card>

					<Card
						hoverable
						className="option-card"
						onClick={onCreatePage}
						style={{ cursor: 'pointer', opacity: 0.6 }}
					>
						<div className="option-content">
							<FileAddOutlined className="option-icon" />
							<div className="option-text">
								<Title level={5}>创建页面</Title>
								<Text type="secondary">创建一个完整页面（暂未实现）</Text>
							</div>
						</div>
					</Card>
				</Space>
			</div>

			<Divider />

			<ConfigTips
				title="使用提示"
				tips={[
					'选择创建表单开始配置基础表单结构',
					'支持 JSON Schema 格式的配置',
					'配置完成后可在右侧实时预览',
					'支持导入/导出配置文件',
				]}
			/>
		</div>
	);
};

export default SelectMode;
