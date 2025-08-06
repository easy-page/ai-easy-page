import * as React from 'react';
import { 
	HomeOutlined, 
	UserOutlined, 
	SettingOutlined, 
	HeartOutlined,
	StarOutlined,
	LikeOutlined,
	MessageOutlined,
	EyeOutlined
} from '@ant-design/icons';

const IconExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				<div style={{ textAlign: 'center' }}>
					<HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>首页</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>用户</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<SettingOutlined style={{ fontSize: '24px', color: '#faad14' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>设置</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<HeartOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>喜欢</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<StarOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>收藏</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<LikeOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>点赞</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<MessageOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>消息</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<EyeOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
					<div style={{ marginTop: '8px', fontSize: '12px' }}>查看</div>
				</div>
			</div>
		</div>
	);
};

export default IconExample; 