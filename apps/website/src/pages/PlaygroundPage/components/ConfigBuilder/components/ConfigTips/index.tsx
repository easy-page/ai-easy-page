import { FC } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface ConfigTipsProps {
	title: string;
	tips: string[];
}

const ConfigTips: FC<ConfigTipsProps> = ({ title, tips }) => {
	return (
		<div className="config-tips">
			<Title level={5}>{title}</Title>
			<ul>
				{tips.map((tip, index) => (
					<li key={index}>{tip}</li>
				))}
			</ul>
		</div>
	);
};

export default ConfigTips;
