import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Drawer } from '@easy-page/pc';
import { Button } from 'antd';

interface DrawerExampleProps {
	isFormComponent?: boolean;
}

const DrawerExample: React.FC<DrawerExampleProps> = ({
	isFormComponent = true,
}) => {
	const [open, setOpen] = React.useState(false);

	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const showDrawer = () => {
		setOpen(true);
	};

	const handleDrawerChange = (value: any) => {
		setOpen(value);
	};

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="drawer" label="抽屉">
						<Button type="primary" onClick={showDrawer}>
							打开抽屉
						</Button>
						<Drawer
							title="抽屉标题"
							placement="right"
							value={open}
							onChange={handleDrawerChange}
						>
							<p>这是抽屉的内容</p>
							<p>可以放置任何组件</p>
						</Drawer>
					</FormItem>
					<FormItem id="submit">
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}

	return (
		<div style={{ padding: '16px' }}>
			<Button type="primary" onClick={showDrawer}>
				打开抽屉
			</Button>
			<Drawer
				title="抽屉标题"
				placement="right"
				value={open}
				onChange={handleDrawerChange}
			>
				<p>这是抽屉的内容</p>
				<p>可以放置任何组件</p>
			</Drawer>
		</div>
	);
};

export default DrawerExample;
