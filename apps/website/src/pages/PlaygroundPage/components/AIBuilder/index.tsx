import { FC, useState } from 'react';
import { Button, Card, Space, Typography, Divider, Input, message } from 'antd';
import {
	RobotOutlined,
	SendOutlined,
	MessageOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { VenueChatPanel } from './chat';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AIBuilder: FC = () => {
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = () => {
		if (!inputValue.trim()) {
			message.warning('请输入描述内容');
			return;
		}
		// AI 处理逻辑
		console.log('发送消息:', inputValue);
		setIsLoading(true);
		// 模拟处理
		setTimeout(() => {
			setIsLoading(false);
			message.info('AI 功能正在开发中...');
		}, 1000);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && e.ctrlKey) {
			handleSendMessage();
		}
	};

	return (
		<div className="ai-builder">
			<VenueChatPanel venueId={0} />
		</div>
	);
};

export default AIBuilder;
