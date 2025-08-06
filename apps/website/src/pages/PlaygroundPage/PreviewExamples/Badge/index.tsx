import * as React from 'react';
import { Badge, Button, Avatar } from 'antd';
import { 
	BellOutlined, 
	UserOutlined, 
	ShoppingCartOutlined,
	MessageOutlined
} from '@ant-design/icons';

const BadgeExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h4>基础徽标</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Badge count={5}>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
					<Badge count={0} showZero>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
					<Badge count={<BellOutlined style={{ color: '#f5222d' }} />}>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>独立徽标</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Badge count={25} />
					<Badge count={4} style={{ backgroundColor: '#52c41a' }} />
					<Badge count={109} style={{ backgroundColor: '#87d068' }} />
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>状态点</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Badge status="success" text="成功" />
					<Badge status="error" text="错误" />
					<Badge status="default" text="默认" />
					<Badge status="processing" text="处理中" />
					<Badge status="warning" text="警告" />
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>按钮徽标</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Badge count={5}>
						<Button icon={<BellOutlined />} size="large" />
					</Badge>
					<Badge count={12}>
						<Button icon={<MessageOutlined />} size="large" />
					</Badge>
					<Badge count={99} overflowCount={99}>
						<Button icon={<ShoppingCartOutlined />} size="large" />
					</Badge>
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>自定义样式</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Badge count={5} style={{ backgroundColor: '#52c41a' }}>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
					<Badge count={5} style={{ backgroundColor: '#faad14' }}>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
					<Badge count={5} style={{ backgroundColor: '#722ed1' }}>
						<Avatar shape="square" icon={<UserOutlined />} />
					</Badge>
				</div>
			</div>
		</div>
	);
};

export default BadgeExample; 