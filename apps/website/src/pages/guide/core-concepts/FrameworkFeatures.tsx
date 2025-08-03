import * as React from 'react';
import { useState } from 'react';
import {
	Card,
	Typography,
	Tabs,
	Space,
	Button,
	Row,
	Col,
	Alert,
	Divider,
} from 'antd';
import { motion } from 'framer-motion';
import {
	RocketOutlined,
	BranchesOutlined,
	BookOutlined,
	ThunderboltOutlined,
	ApiOutlined,
	SettingOutlined,
	CodeOutlined,
	EyeOutlined,
	PlayCircleOutlined,
} from '@ant-design/icons';
import CodeHighlight from '../../../components/CodeHighlight';
import DemoContainer from '../../../components/DemoContainer';
import {
	DynamicFormDemo,
	LinkageDemo,
	StateManagementDemo,
	PerformanceDemo,
	ExtensibilityDemo,
	StateControlDemo,
	ConfigModeDemo,
	VisibilityControlDemo,
} from '../../../demos';
import './FrameworkFeatures.less';

const { Title, Paragraph, Text } = Typography;

// 获取demo源代码的函数
const getDemoSourceCode = (demoKey: string): string => {
	const codeMap: Record<string, string> = {
		'dynamic-form': `import React, { useState } from 'react';
import { Form, FormItem } from '@easy-page/core';
import { DynamicForm, Input, Select } from '@easy-page/pc';
import { Button, Space, message, Card } from 'antd';

const DynamicFormDemo: React.FC = () => {
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    console.log('动态表单提交:', values);
    setFormData(values);
    message.success('提交成功！');
  };

  return (
    <Form
      initialValues={{
        userInfos: [
          {
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin',
          },
        ],
      }}
      onSubmit={handleSubmit}
    >
      <DynamicForm
        id="userInfos"
        maxRow={5}
        minRow={1}
        containerType="table"
        rows={[
          {
            rowIndexs: [1, 2, 3, 4, 5],
            fields: [
              <FormItem
                key="name"
                id="name"
                label="姓名"
                required
                validate={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </FormItem>,
              <FormItem
                key="email"
                id="email"
                label="邮箱"
                validate={[
                  {
                    pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
                    message: '邮箱格式不正确',
                  },
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </FormItem>,
              <FormItem key="role" id="role" label="角色">
                <Select
                  placeholder="请选择角色"
                  options={[
                    { label: '管理员', value: 'admin' },
                    { label: '用户', value: 'user' },
                    { label: '访客', value: 'guest' },
                  ]}
                />
              </FormItem>,
            ],
          },
        ]}
      />

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit">
          提交表单
        </Button>
        <Button htmlType="reset">重置表单</Button>
      </Space>
    </Form>
  );
};

export default DynamicFormDemo;`,
		linkage: `import React, { useState } from 'react';
import { Form, FormItem, FormStore } from '@easy-page/core';
import { Select, Input } from '@easy-page/pc';
import { Button, Space, message, Card, Alert } from 'antd';

const LinkageDemo: React.FC = () => {
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    console.log('联动表单提交:', values);
    setFormData(values);
    message.success('提交成功！');
  };

  return (
    <Form
      initialValues={{
        country: '',
        province: '',
        city: '',
        district: '',
      }}
      onSubmit={handleSubmit}
    >
      <FormItem
        id="country"
        label="国家"
        effects={[
          {
            effectedKeys: ['province', 'city', 'district'],
            handler: async (params: {
              store: FormStore;
              rowInfo?: any;
              value: any;
              rowValue: any;
            }) => {
              const { store } = params;
              const country = store.getValue('country');
              console.log('国家变化:', country);

              // 模拟异步操作
              await new Promise((resolve) => setTimeout(resolve, 500));

              return {
                province: { fieldValue: '', fieldProps: {} },
                city: { fieldValue: '', fieldProps: {} },
                district: { fieldValue: '', fieldProps: {} },
              };
            },
          },
        ]}
      >
        <Select
          placeholder="请选择国家"
          options={[
            { label: '中国', value: 'china' },
            { label: '美国', value: 'usa' },
            { label: '日本', value: 'japan' },
          ]}
        />
      </FormItem>

      {/* 更多字段... */}
    </Form>
  );
};

export default LinkageDemo;`,
		// 其他demo的源代码...
	};

	return codeMap[demoKey] || '// 源代码加载中...';
};

const FrameworkFeatures: React.FC = () => {
	const [activeFeature, setActiveFeature] = useState('dynamic-form');

	const features = [
		{
			key: 'dynamic-form',
			icon: <RocketOutlined />,
			title: '强大的动态表单',
			description: '支持各种动态表单布局场景，轻松应对复杂业务需求',
			component: <DynamicFormDemo />,
			highlights: [
				'支持 Tab、表格、自定义容器等多种布局',
				'动态添加删除表单行',
				'支持复杂的行间联动和验证',
				'配置化的表单结构定义',
			],
		},
		{
			key: 'linkage',
			icon: <BranchesOutlined />,
			title: '超强联动能力',
			description: '多字段联动、父子表单联动、上下文联动校验，游刃有余',
			component: <LinkageDemo />,
			highlights: [
				'Effects（副作用）和 Actions（动作）机制',
				'支持多级联动、条件联动',
				'异步数据处理和加载',
				'循环检测防止死循环',
			],
		},
		{
			key: 'state-management',
			icon: <BookOutlined />,
			title: '统一状态管理',
			description: '将 effects、actions、apis 统一管理，降低复杂度',
			component: <StateManagementDemo />,
			highlights: [
				'基于 MobX 的响应式状态管理',
				'统一的请求管理和依赖处理',
				'支持请求并发控制',
				'完整的状态同步机制',
			],
		},
		{
			key: 'performance',
			icon: <ThunderboltOutlined />,
			title: '高性能精准渲染',
			description: '基于 MobX，统一调度管理，所有变更都是精准渲染',
			component: <PerformanceDemo />,
			highlights: [
				'MobX 响应式更新，只更新变化的字段',
				'调度中心控制并发执行',
				'条件触发避免不必要计算',
				'内存管理和自动清理',
			],
		},
		{
			key: 'extensibility',
			icon: <ApiOutlined />,
			title: '超强扩展性',
			description: '轻松扩展任意组件库，模块化复用，提升开发效率',
			component: <ExtensibilityDemo />,
			highlights: [
				'核心逻辑与 UI 库解耦',
				'支持多端适配（PC、Mobile）',
				'自定义验证器和组件',
				'插件化的设计理念',
			],
		},
		{
			key: 'state-control',
			icon: <SettingOutlined />,
			title: '灵活状态控制',
			description: '支持字段禁用切换、外部上下文联动，适应各种业务场景',
			component: <StateControlDemo />,
			highlights: [
				'全局禁用状态一键控制',
				'字段级别的状态管理',
				'外部状态监听和联动',
				'多种业务场景适配',
			],
		},
		{
			key: 'config-mode',
			icon: <CodeOutlined />,
			title: '开发配置双模式',
			description: '既可开发也可配置，支持 JSON 化动态渲染',
			component: <ConfigModeDemo />,
			highlights: [
				'JSX 声明式开发模式',
				'JSON 配置驱动模式',
				'支持动态表单配置下发',
				'开发友好的 API 设计',
			],
		},
		{
			key: 'visibility-control',
			icon: <EyeOutlined />,
			title: '智能显隐控制',
			description: '沉淀显示隐藏控制能力，实现各种场景展示需求',
			component: <VisibilityControlDemo />,
			highlights: [
				'When 组件精准依赖监听',
				'Container 容器级别显隐',
				'动态表单行级别控制',
				'性能优化的显隐机制',
			],
		},
	];

	const currentFeature = features.find((f) => f.key === activeFeature);

	return (
		<div className="framework-features">
			<Row gutter={[24, 24]}>
				{/* 左侧特点列表 */}
				<Col xs={24} lg={8}>
					<Card className="features-nav sci-fi-card">
						<Title level={4} style={{ color: '#fff' }}>
							核心特点
						</Title>
						<div className="features-list">
							{features.map((feature, index) => (
								<motion.div
									key={feature.key}
									className={`feature-item ${
										activeFeature === feature.key ? 'active' : ''
									}`}
									onClick={() => setActiveFeature(feature.key)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<div className="feature-icon">{feature.icon}</div>
									<div className="feature-content">
										<div className="feature-title">{feature.title}</div>
										<div className="feature-description">
											{feature.description}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</Card>
				</Col>

				{/* 右侧详细内容 */}
				<Col xs={24} lg={16}>
					<motion.div
						key={activeFeature}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="feature-detail-container"
					>
						<div className="feature-header">
							<div className="feature-icon-large">{currentFeature?.icon}</div>
							<div>
								<Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>
									{currentFeature?.title}
								</Title>
								<Paragraph
									style={{ color: '#ccc', margin: 0, fontSize: '16px' }}
								>
									{currentFeature?.description}
								</Paragraph>
							</div>
						</div>

						<div
							className="feature-highlights"
							style={{ marginTop: 32, marginBottom: 32 }}
						>
							<Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
								核心亮点
							</Title>
							<Row gutter={[16, 16]}>
								{currentFeature?.highlights.map((highlight, index) => (
									<Col xs={24} sm={12} key={index}>
										<div className="highlight-item">
											<PlayCircleOutlined className="highlight-icon" />
											<span>{highlight}</span>
										</div>
									</Col>
								))}
							</Row>
						</div>

						<div className="feature-demo">
							<Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
								技术实现与示例
							</Title>
							<DemoContainer
								sourceCode={getDemoSourceCode(currentFeature?.key || '')}
								sourceFile={`${currentFeature?.key}Demo.tsx`}
								githubUrl={`https://github.com/easy-page/ai-easy-page/blob/main/apps/website/src/demos/${currentFeature?.key}Demo.tsx`}
								highlights={currentFeature?.highlights}
							>
								{currentFeature?.component}
							</DemoContainer>
						</div>
					</motion.div>
				</Col>
			</Row>

			{/* 底部总结 */}
			<motion.div
				className="features-summary"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				<Card className="summary-card sci-fi-card">
					<Title level={3} className="summary-title">
						为什么选择 Easy Page？
					</Title>
					<Row gutter={[24, 24]}>
						<Col xs={24} md={8}>
							<div className="summary-item">
								<Title level={4}>🚀 开发效率</Title>
								<Paragraph style={{ color: '#ccc' }}>
									声明式 API 设计，开箱即用的组件库，大幅提升表单开发效率。
								</Paragraph>
							</div>
						</Col>
						<Col xs={24} md={8}>
							<div className="summary-item">
								<Title level={4}>⚡ 性能优异</Title>
								<Paragraph style={{ color: '#ccc' }}>
									基于 MobX 的精准渲染，调度中心优化，确保最佳性能表现。
								</Paragraph>
							</div>
						</Col>
						<Col xs={24} md={8}>
							<div className="summary-item">
								<Title level={4}>🔧 灵活扩展</Title>
								<Paragraph style={{ color: '#ccc' }}>
									模块化设计，支持任意组件库扩展，适应各种业务场景需求。
								</Paragraph>
							</div>
						</Col>
					</Row>
				</Card>
			</motion.div>
		</div>
	);
};

export default FrameworkFeatures;
