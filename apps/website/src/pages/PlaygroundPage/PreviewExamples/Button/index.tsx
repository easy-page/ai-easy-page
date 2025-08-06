import * as React from 'react';
import { Button } from 'antd';

const ButtonExample: React.FC = () => {
	const handleClick = () => {
		console.log('按钮被点击了');
		alert('按钮被点击了！');
	};

	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: 16 }}>
				<Button type="primary" onClick={handleClick}>
					主要按钮
				</Button>
			</div>
			<div style={{ marginBottom: 16 }}>
				<Button onClick={handleClick}>默认按钮</Button>
			</div>
			<div style={{ marginBottom: 16 }}>
				<Button type="dashed" onClick={handleClick}>
					虚线按钮
				</Button>
			</div>
			<div style={{ marginBottom: 16 }}>
				<Button type="text" onClick={handleClick}>
					文本按钮
				</Button>
			</div>
			<div style={{ marginBottom: 16 }}>
				<Button type="link" onClick={handleClick}>
					链接按钮
				</Button>
			</div>
		</div>
	);
};

export default ButtonExample;
