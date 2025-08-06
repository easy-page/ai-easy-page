import * as React from 'react';
import { Form } from '@easy-page/core';
import { Container } from '@easy-page/pc';

const ContainerExample: React.FC = () => {
	const handleSubmit = (values: any) => {
		console.log('容器表单提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	return (
		<div style={{ padding: '16px' }}>
			<Form onSubmit={handleSubmit}>
				{/* 卡片容器 */}
				<Container
					containerType="Card"
					layout="vertical"
					title="卡片容器示例"
					titleType="h1"
					show={() => true}
					style={{ marginBottom: 16 }}
				>
					<div>这是卡片容器内的内容</div>
					<div>可以包含任意内容</div>
				</Container>

				{/* 有边框容器 */}
				<Container
					containerType="Bordered"
					layout="horizontal"
					title="有边框容器示例"
					titleType="h2"
					show={() => true}
					style={{ marginBottom: 16 }}
				>
					<div>左侧内容</div>
					<div>右侧内容</div>
				</Container>

				{/* 自定义容器 */}
				<Container
					customContainer={({ children }) => (
						<div
							style={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								padding: '20px',
								borderRadius: '12px',
								marginBottom: 16,
							}}
						>
							{children}
						</div>
					)}
					title="自定义容器示例"
					titleType="h3"
					show={() => true}
				>
					<div>自定义渐变背景容器</div>
					<div>可以自定义样式和布局</div>
				</Container>
			</Form>
		</div>
	);
};

export default ContainerExample;
