import * as React from 'react';
import { Result, Button } from 'antd';

const ResultExample: React.FC = () => {
	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h4>成功结果</h4>
				<Result
					status="success"
					title="操作成功"
					subTitle="您的操作已经成功完成，感谢您的使用。"
					extra={[
						<Button type="primary" key="console">
							继续操作
						</Button>,
						<Button key="buy">查看详情</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>错误结果</h4>
				<Result
					status="error"
					title="操作失败"
					subTitle="很抱歉，您的操作失败了，请重试。"
					extra={[
						<Button type="primary" key="console">
							重试
						</Button>,
						<Button key="buy">返回</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>信息结果</h4>
				<Result
					status="info"
					title="信息提示"
					subTitle="这是一条重要的信息提示。"
					extra={[
						<Button type="primary" key="console">
							知道了
						</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>警告结果</h4>
				<Result
					status="warning"
					title="警告提示"
					subTitle="请注意，您的操作可能存在风险。"
					extra={[
						<Button type="primary" key="console">
							继续
						</Button>,
						<Button key="buy">取消</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>404 结果</h4>
				<Result
					status="404"
					title="404"
					subTitle="抱歉，您访问的页面不存在。"
					extra={[
						<Button type="primary" key="console">
							返回首页
						</Button>,
						<Button key="buy">联系客服</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>403 结果</h4>
				<Result
					status="403"
					title="403"
					subTitle="抱歉，您没有权限访问此页面。"
					extra={[
						<Button type="primary" key="console">
							申请权限
						</Button>,
						<Button key="buy">返回</Button>,
					]}
				/>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>500 结果</h4>
				<Result
					status="500"
					title="500"
					subTitle="抱歉，服务器出现了问题。"
					extra={[
						<Button type="primary" key="console">
							重试
						</Button>,
						<Button key="buy">返回</Button>,
					]}
				/>
			</div>
		</div>
	);
};

export default ResultExample; 