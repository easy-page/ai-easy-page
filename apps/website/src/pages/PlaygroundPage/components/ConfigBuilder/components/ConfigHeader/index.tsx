import { FC, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined, CodeOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface ConfigHeaderProps {
	title: string;
	showBack?: boolean;
	showImport?: boolean;
	onBack?: () => void;
	onImport?: () => void;
	children?: ReactNode;
}

const ConfigHeader: FC<ConfigHeaderProps> = ({
	title,
	showBack = false,
	showImport = false,
	onBack,
	onImport,
	children,
}) => {
	return (
		<div className="config-header">
			{(showBack || showImport) && (
				<div className="header-actions">
					{showBack && (
						<Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
							返回
						</Button>
					)}
					{showImport && (
						<Button
							type="primary"
							size="small"
							icon={<CodeOutlined />}
							onClick={onImport}
						>
							导入配置
						</Button>
					)}
				</div>
			)}
			<Title level={4}>{title}</Title>
			{children}
		</div>
	);
};

export default ConfigHeader;
