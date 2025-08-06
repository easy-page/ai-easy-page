import * as React from 'react';
import { Divider } from 'antd';

const DividerExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<p>这是一段文本内容</p>
			<Divider />
			<p>这是分隔线下方的文本内容</p>
			
			<Divider orientation="left">左侧标题</Divider>
			<p>这是左侧标题分隔线的内容</p>
			
			<Divider orientation="right">右侧标题</Divider>
			<p>这是右侧标题分隔线的内容</p>
			
			<Divider orientation="center">居中标题</Divider>
			<p>这是居中标题分隔线的内容</p>
			
			<Divider dashed />
			<p>这是虚线分隔线的内容</p>
			
			<Divider type="vertical" style={{ height: '40px' }} />
			<span>垂直分隔线</span>
		</div>
	);
};

export default DividerExample; 