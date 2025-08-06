import * as React from 'react';
import { Progress, Button } from 'antd';

const ProgressExample: React.FC = () => {
	const [percent, setPercent] = React.useState(0);

	const increase = () => {
		const newPercent = percent + 10;
		if (newPercent > 100) {
			setPercent(100);
		} else {
			setPercent(newPercent);
		}
	};

	const decline = () => {
		const newPercent = percent - 10;
		if (newPercent < 0) {
			setPercent(0);
		} else {
			setPercent(newPercent);
		}
	};

	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h4>基础进度条</h4>
				<Progress percent={30} />
				<Progress percent={50} status="active" />
				<Progress percent={70} status="exception" />
				<Progress percent={100} />
			</div>

			<div style={{ marginBottom: '24px' }}>
				<h4>不同尺寸</h4>
				<Progress percent={30} size="small" />
				<Progress percent={50} />
				<Progress percent={70} />
			</div>

			<div style={{ marginBottom: '24px' }}>
				<h4>圆形进度条</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Progress type="circle" percent={75} />
					<Progress type="circle" percent={70} status="exception" />
					<Progress type="circle" percent={100} />
				</div>
			</div>

			<div style={{ marginBottom: '24px' }}>
				<h4>动态进度条</h4>
				<Progress percent={percent} />
				<div style={{ marginTop: '16px' }}>
					<Button.Group>
						<Button onClick={decline}>-</Button>
						<Button onClick={increase}>+</Button>
					</Button.Group>
				</div>
			</div>

			<div style={{ marginBottom: '24px' }}>
				<h4>自定义颜色</h4>
				<Progress percent={30} strokeColor="#52c41a" />
				<Progress percent={50} strokeColor="#1890ff" />
				<Progress percent={70} strokeColor="#faad14" />
				<Progress percent={90} strokeColor="#f5222d" />
			</div>

			<div style={{ marginBottom: '24px' }}>
				<h4>带文字的进度条</h4>
				<Progress percent={60} format={(percent) => `${percent}%`} />
				<Progress percent={100} format={() => '完成'} />
			</div>
		</div>
	);
};

export default ProgressExample;
