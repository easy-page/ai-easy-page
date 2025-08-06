import * as React from 'react';
import { Empty, Button } from 'antd';

const EmptyExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h4>基础空状态</h4>
				<Empty />
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>自定义图片</h4>
				<Empty
					image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
					description="暂无数据"
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>自定义描述</h4>
				<Empty
					description="暂无数据，请稍后再试"
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>带操作按钮</h4>
				<Empty
					description="暂无数据"
				>
					<Button type="primary">创建数据</Button>
				</Empty>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>小尺寸</h4>
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description="暂无数据"
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>自定义样式</h4>
				<Empty
					description="暂无数据"
					style={{
						padding: '40px',
						background: '#f5f5f5',
						borderRadius: '8px'
					}}
				>
					<Button type="primary">添加数据</Button>
				</Empty>
			</div>
		</div>
	);
};

export default EmptyExample; 