import { FC } from 'react';
import { Typography } from 'antd';
import ConfigHeader from '../ConfigHeader';

const { Text } = Typography;

interface PageModeProps {
	onBack: () => void;
}

const PageMode: FC<PageModeProps> = ({ onBack }) => {
	return (
		<div className="config-builder">
			<ConfigHeader title="页面配置" showBack onBack={onBack} />

			<div className="config-placeholder">
				<Text type="secondary">页面配置功能暂未实现，敬请期待...</Text>
			</div>
		</div>
	);
};

export default PageMode;
