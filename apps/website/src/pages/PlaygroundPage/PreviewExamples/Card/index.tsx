import * as React from 'react';
import { Card, Button } from 'antd';
import { HeartOutlined, ShareAltOutlined, MoreOutlined } from '@ant-design/icons';

const { Meta } = Card;

const CardExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				<Card
					hoverable
					style={{ width: 240 }}
					cover={
						<img
							alt="示例图片"
							src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
						/>
					}
					actions={[
						<HeartOutlined key="heart" />,
						<ShareAltOutlined key="share" />,
						<MoreOutlined key="more" />,
					]}
				>
					<Meta
						title="卡片标题"
						description="这是一张卡片的描述信息，可以包含多行文本内容。"
					/>
				</Card>
				
				<Card
					title="带标题的卡片"
					style={{ width: 300 }}
					extra={<Button type="link">更多</Button>}
				>
					<p>这是卡片的内容区域</p>
					<p>可以包含任何组件和文本</p>
					<Button type="primary">操作按钮</Button>
				</Card>
				
				<Card
					title="可折叠卡片"
					style={{ width: 300 }}
					extra={<Button type="link">展开</Button>}
				>
					<p>这是可折叠卡片的内容</p>
					<p>点击右上角按钮可以展开或收起</p>
				</Card>
			</div>
		</div>
	);
};

export default CardExample; 