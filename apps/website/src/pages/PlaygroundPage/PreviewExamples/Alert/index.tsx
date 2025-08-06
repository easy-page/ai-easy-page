import * as React from 'react';
import { Alert } from 'antd';

const AlertExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '16px' }}>
				<Alert
					message="成功提示"
					description="这是一条成功提示的详细描述。"
					type="success"
					showIcon
				/>
			</div>
			
			<div style={{ marginBottom: '16px' }}>
				<Alert
					message="信息提示"
					description="这是一条信息提示的详细描述。"
					type="info"
					showIcon
				/>
			</div>
			
			<div style={{ marginBottom: '16px' }}>
				<Alert
					message="警告提示"
					description="这是一条警告提示的详细描述。"
					type="warning"
					showIcon
				/>
			</div>
			
			<div style={{ marginBottom: '16px' }}>
				<Alert
					message="错误提示"
					description="这是一条错误提示的详细描述。"
					type="error"
					showIcon
				/>
			</div>
			
			<div style={{ marginBottom: '16px' }}>
				<Alert
					message="可关闭的提示"
					description="这是一条可以关闭的提示信息。"
					type="info"
					closable
					showIcon
				/>
			</div>
		</div>
	);
};

export default AlertExample; 