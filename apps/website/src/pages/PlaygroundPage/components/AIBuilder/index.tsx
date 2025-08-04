import { FC } from 'react';
import { RobotOutlined } from '@ant-design/icons';

const AIBuilder: FC = () => {
	return (
		<div className="ai-builder">
			<div className="ai-header">
				<h3>AI 智能搭建</h3>
				<div className="ai-placeholder">
					<RobotOutlined
						style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}
					/>
					<h4>AI 助手正在开发中...</h4>
					<p>即将支持通过自然语言描述来生成表单配置</p>
					<div className="ai-examples">
						<h5>示例对话：</h5>
						<div className="example-item">
							<strong>用户：</strong>帮我创建一个用户注册表单
						</div>
						<div className="example-item">
							<strong>AI：</strong>
							好的，我来为您创建一个包含姓名、邮箱、密码等字段的注册表单...
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIBuilder;
