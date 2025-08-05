import { FC, useState } from 'react';
import { Button, Card, Space, Typography, Divider, Input, message } from 'antd';
import {
	RobotOutlined,
	SendOutlined,
	MessageOutlined,
	SettingOutlined,
} from '@ant-design/icons';

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
			<div className="ai-header">
				<Title level={4}>
					<RobotOutlined /> AI 智能搭建
				</Title>
				<Text type="secondary">通过自然语言描述生成表单配置</Text>
			</div>

			<div className="ai-content">
				{/* 对话区域 */}
				<div className="ai-chat-area">
					<div className="chat-messages">
						<div className="message ai-message">
							<div className="message-avatar">
								<RobotOutlined />
							</div>
							<div className="message-content">
								<Text strong>AI 助手</Text>
								<Paragraph>
									你好！我是 AI 助手，可以通过自然语言描述帮你生成表单配置。
									请告诉我你想要创建什么样的表单？
								</Paragraph>
							</div>
						</div>
					</div>
				</div>

				<Divider />

				{/* 输入区域 */}
				<div className="ai-input-area">
					<TextArea
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="请描述你想要的表单，例如：创建一个用户注册表单，包含姓名、邮箱、密码等字段"
						autoSize={{ minRows: 3, maxRows: 6 }}
						disabled={isLoading}
					/>
					<div className="input-actions">
						<Space>
							<Text type="secondary" style={{ fontSize: '12px' }}>
								按 Ctrl + Enter 发送
							</Text>
							<Button
								type="primary"
								icon={<SendOutlined />}
								onClick={handleSendMessage}
								loading={isLoading}
								disabled={!inputValue.trim()}
							>
								发送
							</Button>
						</Space>
					</div>
				</div>

				<Divider />

				{/* 示例区域 */}
				<div className="ai-examples">
					<Title level={5}>
						<MessageOutlined /> 示例对话
					</Title>
					<Space direction="vertical" style={{ width: '100%' }}>
						<Card size="small" className="example-card">
							<div className="example-item">
								<Text strong>用户：</Text>
								<Text>帮我创建一个用户注册表单</Text>
							</div>
							<div className="example-item">
								<Text strong>AI：</Text>
								<Text>
									好的，我来为您创建一个包含姓名、邮箱、密码等字段的注册表单...
								</Text>
							</div>
						</Card>
						<Card size="small" className="example-card">
							<div className="example-item">
								<Text strong>用户：</Text>
								<Text>添加手机号验证</Text>
							</div>
							<div className="example-item">
								<Text strong>AI：</Text>
								<Text>已为您添加手机号字段，并配置了格式验证规则</Text>
							</div>
						</Card>
					</Space>
				</div>

				<Divider />

				{/* 设置区域 */}
				<div className="ai-settings">
					<Title level={5}>
						<SettingOutlined /> AI 设置
					</Title>
					<Text type="secondary">AI 功能正在开发中，敬请期待...</Text>
				</div>
			</div>
		</div>
	);
};

export default AIBuilder;
