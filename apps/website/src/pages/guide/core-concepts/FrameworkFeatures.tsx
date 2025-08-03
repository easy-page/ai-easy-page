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
import './FrameworkFeatures.less';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// Demo 组件示例
const DynamicFormDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`import { Form, FormItem } from '@easy-page/core';
import { DynamicForm, Input, Select } from '@easy-page/pc';

<Form onSubmit={handleSubmit}>
  <DynamicForm
    id="userInfos"
    maxRow={5}
    minRow={1}
    containerType="table" // 支持 tab、table、自定义容器
    rows={[
      {
        rowIndexs: [1, 2, 3, 4, 5],
        fields: [
          <FormItem id="name" label="姓名" required>
            <Input placeholder="请输入姓名" />
          </FormItem>,
          <FormItem id="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </FormItem>,
          <FormItem id="role" label="角色">
            <Select options={roleOptions} />
          </FormItem>,
        ],
      },
    ]}
  />
</Form>`}
			</CodeHighlight>
			<Alert
				message="动态表单特性"
				description="支持 Tab 布局、表格布局、自定义容器等多种展示方式，可动态添加删除表单行，支持复杂的行间联动和验证。"
				type="info"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const LinkageDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`<FormItem
  id="country"
  label="国家"
  effects={[
    {
      effectedKeys: ['province', 'city'],
      handler: async ({ store }) => {
        const country = store.getValue('country');
        return {
          province: { fieldValue: '', fieldProps: {} },
          city: { fieldValue: '', fieldProps: {} },
        };
      },
    },
  ]}
>
  <Select options={countryOptions} />
</FormItem>

<FormItem
  id="province"
  label="省份"
  actions={[
    {
      effectedBy: ['country'],
      handler: async ({ store }) => {
        const country = store.getValue('country');
        const options = await fetchProvinces(country);
        return {
          fieldValue: '',
          fieldProps: { options, placeholder: '请选择省份' },
        };
      },
    },
  ]}
>
  <Select options={[]} />
</FormItem>`}
			</CodeHighlight>
			<Alert
				message="联动机制"
				description="Effects（副作用）配置在变化的字段上，Actions（动作）配置在被影响的字段上。支持多级联动、条件联动、异步数据处理。"
				type="success"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const StateManagementDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`import { createFormStore } from '@easy-page/core';

// 创建表单 Store
const store = createFormStore({
  username: '',
  email: '',
  permissions: [],
});

// 统一管理 effects、actions、apis
<Form
  store={store}
  initReqs={{
    userDetail: {
      req: async ({ store }) => {
        const result = await fetchUserDetail();
        return result;
      },
      mode: ['edit', 'view'],
    },
    permissions: {
      req: async ({ store, effectedData }) => {
        const userDetail = effectedData?.userDetail;
        return await fetchPermissions(userDetail.role);
      },
      depends: ['userDetail'],
    },
  }}
>
  {/* 表单内容 */}
</Form>`}
			</CodeHighlight>
			<Alert
				message="统一状态管理"
				description="基于 MobX 的响应式状态管理，将 effects、actions、apis 统一管理，支持请求依赖、并发控制、状态同步。"
				type="warning"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const PerformanceDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`// MobX 响应式更新 - 只更新变化的字段
const FormStoreImpl = makeAutoObservable({
  state: {
    values: {},
    fields: {},
    processing: false,
  },

  setValue(field: string, value: any) {
    runInAction(() => {
      this.state.values[field] = value;
      // 只触发相关字段的更新
    });

    // 异步触发联动，不阻塞 UI
    setTimeout(() => {
      this.triggerEffectsAndActions(field);
    }, 0);
  },
});

// 调度中心控制并发
class Scheduler {
  private maxConcurrent = 5;
  private running = new Set();
  private queue: Array<() => Promise<any>> = [];

  async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.running.size < this.maxConcurrent) {
      return this.execute(task);
    }
    // 超出并发限制，加入队列
    return new Promise((resolve, reject) => {
      this.queue.push(() => this.execute(task).then(resolve).catch(reject));
    });
  }
}`}
			</CodeHighlight>
			<Alert
				message="性能优化"
				description="基于 MobX 的精准渲染，调度中心控制并发，循环检测防止死循环，条件触发避免不必要计算。"
				type="error"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const ExtensibilityDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`// 扩展任意组件库
// packages/easy-page-pc - Ant Design 适配
export const Input: React.FC<InputProps> = ({ id, ...props }) => {
  const { store } = useFormContext();
  const value = store.getValue(id);

  return (
    <AntInput
      {...props}
      value={value}
      onChange={(e) => store.setValue(id, e.target.value)}
    />
  );
};

// packages/easy-page-mobile - Ant Design Mobile 适配
export const Input: React.FC<InputProps> = ({ id, ...props }) => {
  const { store } = useFormContext();
  const value = store.getValue(id);

  return (
    <AntMobileInput
      {...props}
      value={value}
      onChange={(value) => store.setValue(id, value)}
    />
  );
};

// 自定义验证器扩展
const validator = new FormValidator();
validator.addRule('customPhone', async (value, rule, store) => {
  const phoneRegex = /^1[3-9]\\d{9}$/;
  if (!phoneRegex.test(value)) {
    return { valid: false, message: '手机号格式不正确' };
  }
  return { valid: true };
});`}
			</CodeHighlight>
			<Alert
				message="超强扩展性"
				description="核心逻辑与 UI 解耦，可轻松适配任意组件库。支持自定义验证器、自定义组件、自定义联动逻辑。"
				type="info"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const StateControlDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`// 全局禁用状态控制
const store = createFormStore({ username: '', email: '' });

// 一键禁用整个表单
store.setDisabled(true);

// 与外部状态联动
useExternalStateListener(store, activityStatus, [
  {
    fields: ['username', 'email'],
    handler: async (externalState, store) => {
      if (externalState === 'maintenance') {
        store.setDisabled(true);
      } else if (externalState === 'active') {
        store.setDisabled(false);
      }

      return {
        username: {
          fieldProps: {
            placeholder: externalState === 'active'
              ? '请输入用户名'
              : '系统维护中...'
          }
        }
      };
    },
  },
]);

// 字段级别的状态控制
<FormItem
  id="userType"
  effects={[{
    effectedKeys: ['company', 'school'],
    handler: async ({ store }) => {
      const userType = store.getValue('userType');
      return {
        company: {
          fieldProps: { disabled: userType !== 'company' }
        },
        school: {
          fieldProps: { disabled: userType !== 'student' }
        },
      };
    },
  }]}
>`}
			</CodeHighlight>
			<Alert
				message="灵活状态控制"
				description="支持全局禁用状态、字段级别状态控制、外部状态联动，适应各种业务场景的状态管理需求。"
				type="success"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const ConfigModeDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`// 开发模式 - JSX 声明式
<Form onSubmit={handleSubmit}>
  <FormItem id="username" label="用户名" required>
    <Input placeholder="请输入用户名" />
  </FormItem>
  <FormItem id="email" label="邮箱">
    <Input placeholder="请输入邮箱" />
  </FormItem>
</Form>

// 配置模式 - JSON 驱动
const formConfig = {
  fields: [
    {
      id: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      props: { placeholder: '请输入用户名' },
      validate: [{ required: true, message: '请输入用户名' }],
    },
    {
      id: 'email',
      label: '邮箱',
      type: 'input',
      props: { placeholder: '请输入邮箱' },
      validate: [{ pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: '邮箱格式不正确' }],
    },
  ],
  effects: [
    {
      field: 'username',
      effectedKeys: ['email'],
      handler: 'resetEmailWhenUsernameChange',
    },
  ],
};

<ConfigurableForm config={formConfig} onSubmit={handleSubmit} />`}
			</CodeHighlight>
			<Alert
				message="开发配置双模式"
				description="既支持 JSX 声明式开发，也支持 JSON 配置驱动。可实现表单配置的动态下发和渲染。"
				type="warning"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

const VisibilityControlDemo = () => {
	return (
		<div className="demo-container">
			<CodeHighlight language="tsx">
				{`// When 组件 - 条件显示
<When
  effectedBy={['userType', 'region']}
  show={({ effectedValues }) => {
    return effectedValues.userType === 'vip' && effectedValues.region === 'china';
  }}
>
  <FormItem id="vipLevel" label="VIP 等级">
    <Select options={vipLevelOptions} />
  </FormItem>
</When>

// Container 组件 - 容器级别显隐
<Container
  containerType="Card"
  title="高级设置"
  effectedBy={['userType']}
  show={({ effectedValues }) => effectedValues.userType === 'admin'}
>
  <FormItem id="adminSetting1" label="管理员设置1">
    <Input />
  </FormItem>
  <FormItem id="adminSetting2" label="管理员设置2">
    <Input />
  </FormItem>
</Container>

// 动态表单中的显隐控制
<DynamicForm
  rows={[
    {
      rowIndexs: [1, 2],
      fields: [
        <When
          effectedBy={['showAdvanced']}
          show={({ effectedValues }) => effectedValues.showAdvanced}
        >
          <FormItem id="advancedField" label="高级字段">
            <Input />
          </FormItem>
        </When>
      ],
    },
  ]}
/>`}
			</CodeHighlight>
			<Alert
				message="智能显隐控制"
				description="When 组件支持精准的依赖监听，Container 组件支持容器级别显隐，动态表单支持行级别显隐控制。"
				type="info"
				showIcon
				style={{ marginTop: 16 }}
			/>
		</div>
	);
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
							{currentFeature?.component}
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
