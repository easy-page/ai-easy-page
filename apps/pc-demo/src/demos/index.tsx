import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import BasicFormDemo from './BasicFormDemo';
import FieldFeaturesDemo from './FieldFeaturesDemo';
import FieldLinkageDemo from './FieldLinkageDemo';
import ExternalStateDemo from './ExternalStateDemo';
import FormDisabledDemo from './FormDisabledDemo';
import DynamicFormDemo from './DynamicFormDemo';
import LinkageValidationDemo from './LinkageValidationDemo';
import WhenDemo from './when';
import ContainerDemo from './ContainerDemo';

import LoadingTestDemo from './LoadingTestDemo';
import SelectDemo from './SelectDemo';

const { Title, Paragraph } = Typography;

const DemoShowcase: React.FC = () => {
	const [activeKey, setActiveKey] = useState('basic');

	const demoItems = [
		{
			key: 'basic',
			label: '基础表单',
			children: <BasicFormDemo />,
			description:
				'展示所有基本组件的基础使用，包括 Input、Select 等组件的简单用法。',
		},
		{
			key: 'features',
			label: '字段特性',
			children: <FieldFeaturesDemo />,
			description:
				'展示字段的完整内容：label、id、validate、extra、tips、required 等。其中 extra 和 tips 根据其他字段变化展示联动文字。',
		},
		{
			key: 'linkage',
			label: '字段联动',
			children: <FieldLinkageDemo />,
			description:
				'展示字段联动使用：effects 和 actions，实现级联选择和数据联动。',
		},
		{
			key: 'external',
			label: '外部状态',
			children: <ExternalStateDemo />,
			description:
				'展示外部状态影响内部字段值，通过 useExternalStateListener 监听外部状态变化。',
		},
		{
			key: 'disabled',
			label: '禁用状态',
			children: <FormDisabledDemo />,
			description:
				'展示表单的 disabled 状态控制，根据外部的状态变化，比如活动状态或者是创建、编辑、查看不同模式下的不同编辑态。',
		},
		{
			key: 'dynamic',
			label: '动态表单',
			children: <DynamicFormDemo />,
			description: '展示动态表单的使用，支持动态添加和删除表单行。',
		},
		{
			key: 'validation',
			label: '联动验证',
			children: <LinkageValidationDemo />,
			description: '展示联动验证的使用，实现字段间的相互验证逻辑。',
		},
		{
			key: 'when',
			label: '条件显示',
			children: <WhenDemo />,
			description:
				'展示 When 组件的使用，根据表单字段值条件性地显示或隐藏其他字段。',
		},
		{
			key: 'container',
			label: '容器组件',
			children: <ContainerDemo />,
			description:
				'展示 Container 容器的使用，支持条件渲染、多种布局方式和标题样式。',
		},

		{
			key: 'loading',
			label: 'Loading 测试',
			children: <LoadingTestDemo />,
			description:
				'专门测试 Form 组件的 loading 效果，包括默认 loading 和自定义 loading 组件。',
		},
		{
			key: 'select',
			label: 'Select 演示',
			children: <SelectDemo />,
			description:
				'展示 Select 组件的完整功能：初始化远程加载、字段联动、远程搜索和编辑模式回填。',
		},
	];

	return (
		<div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
			<div style={{ marginBottom: 24 }}>
				<Title level={1}>Easy Page 表单框架 - PC 端 Demo</Title>
				<Paragraph>
					Easy Page 是一个强大的 React
					表单框架，提供了丰富的功能和灵活的配置选项。 本 Demo
					展示了从基础使用到高级功能的完整示例。
				</Paragraph>
			</div>

			<Tabs
				activeKey={activeKey}
				onChange={setActiveKey}
				type="card"
				size="large"
				items={demoItems.map((item) => ({
					key: item.key,
					label: item.label,
					children: (
						<div>
							<Card style={{ marginBottom: 16 }}>
								<Title level={4}>{item.label}</Title>
								<Paragraph>{item.description}</Paragraph>
							</Card>
							{item.children}
						</div>
					),
				}))}
			/>
		</div>
	);
};

export default DemoShowcase;
