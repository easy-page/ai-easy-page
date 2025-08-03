import * as React from 'react';
import { useState } from 'react';
import {
	Card,
	Typography,
	Button,
	Space,
	Row,
	Col,
	message,
	Select,
	Input,
	Form as AntForm,
} from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

// 模拟的 Easy Page 组件（简化版本用于演示）
const MockFormContext = React.createContext<any>(null);

const MockForm: React.FC<{
	children: React.ReactNode;
	onSubmit?: (values: any) => void;
}> = ({ children, onSubmit }) => {
	const [values, setValues] = useState<Record<string, any>>({});

	const store = {
		getValue: (field: string) => values[field] || '',
		setValue: (field: string, value: any) => {
			setValues((prev) => ({ ...prev, [field]: value }));
		},
		getValues: () => values,
	};

	const handleSubmit = () => {
		onSubmit?.(values);
	};

	return (
		<MockFormContext.Provider value={{ store }}>
			<div className="mock-form">
				{children}
				<div style={{ marginTop: 16 }}>
					<Button type="primary" onClick={handleSubmit}>
						提交表单
					</Button>
					<Button
						style={{ marginLeft: 8 }}
						onClick={() => console.log('当前表单值:', values)}
					>
						查看值
					</Button>
				</div>
			</div>
		</MockFormContext.Provider>
	);
};

const MockFormItem: React.FC<{
	id: string;
	label: string;
	children: React.ReactNode;
	effects?: Array<{
		effectedKeys: string[];
		handler: (params: { store: any }) => Promise<any>;
	}>;
}> = ({ id, label, children, effects }) => {
	const { store } = React.useContext(MockFormContext);

	React.useEffect(() => {
		if (effects) {
			// 简化的 effects 处理
			const handleEffects = async () => {
				for (const effect of effects) {
					try {
						const result = await effect.handler({ store });
						Object.entries(result).forEach(([key, update]: [string, any]) => {
							if (update.fieldValue !== undefined) {
								store.setValue(key, update.fieldValue);
							}
						});
					} catch (error) {
						console.error('Effect 执行失败:', error);
					}
				}
			};

			// 监听当前字段变化
			const currentValue = store.getValue(id);
			if (currentValue) {
				handleEffects();
			}
		}
	}, [store.getValue(id)]);

	return (
		<div style={{ marginBottom: 16 }}>
			<label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
				{label}
			</label>
			{children}
		</div>
	);
};

const MockInput: React.FC<{ id: string; placeholder?: string }> = ({
	id,
	placeholder,
}) => {
	const { store } = React.useContext(MockFormContext);

	return (
		<Input
			value={store.getValue(id)}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
				store.setValue(id, e.target.value)
			}
			placeholder={placeholder}
			style={{ width: '100%' }}
		/>
	);
};

const MockSelect: React.FC<{
	id: string;
	placeholder?: string;
	options?: Array<{ label: string; value: string }>;
}> = ({ id, placeholder, options = [] }) => {
	const { store } = React.useContext(MockFormContext);

	return (
		<Select
			value={store.getValue(id)}
			onChange={(value) => store.setValue(id, value)}
			placeholder={placeholder}
			style={{ width: '100%' }}
			options={options}
		/>
	);
};

// Demo 组件
const LinkageDemo: React.FC = () => {
	const [demoValues, setDemoValues] = useState<any>({});

	const countryOptions = [
		{ label: '中国', value: 'china' },
		{ label: '美国', value: 'usa' },
		{ label: '日本', value: 'japan' },
	];

	const getProvinceOptions = (country: string) => {
		const provinceMap: Record<string, any[]> = {
			china: [
				{ label: '北京', value: 'beijing' },
				{ label: '上海', value: 'shanghai' },
				{ label: '广东', value: 'guangdong' },
			],
			usa: [
				{ label: '加利福尼亚', value: 'california' },
				{ label: '纽约', value: 'newyork' },
				{ label: '德克萨斯', value: 'texas' },
			],
			japan: [
				{ label: '东京', value: 'tokyo' },
				{ label: '大阪', value: 'osaka' },
				{ label: '京都', value: 'kyoto' },
			],
		};
		return provinceMap[country] || [];
	};

	return (
		<Card title="🔗 字段联动演示" className="demo-card">
			<Paragraph style={{ color: '#ccc', marginBottom: 24 }}>
				选择国家后，省份选项会自动更新，展示 Effects 和 Actions 的联动能力。
			</Paragraph>

			<MockForm
				onSubmit={(values) => {
					message.success('表单提交成功！');
					console.log('提交的值:', values);
					setDemoValues(values);
				}}
			>
				<MockFormItem
					id="country"
					label="国家"
					effects={[
						{
							effectedKeys: ['province'],
							handler: async ({ store }) => {
								const country = store.getValue('country');
								console.log('国家变化:', country);

								// 模拟异步操作
								await new Promise((resolve) => setTimeout(resolve, 300));

								return {
									province: { fieldValue: '' },
								};
							},
						},
					]}
				>
					<MockSelect
						id="country"
						placeholder="请选择国家"
						options={countryOptions}
					/>
				</MockFormItem>

				<MockFormItem id="province" label="省份/州">
					<MockSelect
						id="province"
						placeholder="请先选择国家"
						options={getProvinceOptions(demoValues.country || '')}
					/>
				</MockFormItem>

				<MockFormItem id="city" label="城市">
					<MockInput id="city" placeholder="请输入城市名称" />
				</MockFormItem>
			</MockForm>

			{Object.keys(demoValues).length > 0 && (
				<div
					style={{
						marginTop: 24,
						padding: 16,
						background: 'rgba(0, 212, 255, 0.1)',
						borderRadius: 8,
						border: '1px solid rgba(0, 212, 255, 0.3)',
					}}
				>
					<Title level={5} style={{ color: '#00d4ff', marginBottom: 12 }}>
						表单数据：
					</Title>
					<pre style={{ color: '#fff', margin: 0 }}>
						{JSON.stringify(demoValues, null, 2)}
					</pre>
				</div>
			)}
		</Card>
	);
};

const DynamicFormDemo: React.FC = () => {
	const [rows, setRows] = useState([{ id: 1, name: '', email: '' }]);

	const addRow = () => {
		const newId = Math.max(...rows.map((r) => r.id)) + 1;
		setRows([...rows, { id: newId, name: '', email: '' }]);
	};

	const removeRow = (id: number) => {
		if (rows.length > 1) {
			setRows(rows.filter((r) => r.id !== id));
		}
	};

	const updateRow = (id: number, field: string, value: string) => {
		setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
	};

	return (
		<Card title="🚀 动态表单演示" className="demo-card">
			<Paragraph style={{ color: '#ccc', marginBottom: 24 }}>
				动态添加删除表单行，支持复杂的表单结构管理。
			</Paragraph>

			<div className="dynamic-form-container">
				{rows.map((row, index) => (
					<motion.div
						key={row.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="dynamic-row"
						style={{
							display: 'flex',
							gap: 16,
							marginBottom: 16,
							padding: 16,
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 8,
							border: '1px solid rgba(255, 255, 255, 0.1)',
						}}
					>
						<div style={{ flex: 1 }}>
							<label
								style={{ display: 'block', marginBottom: 4, color: '#fff' }}
							>
								姓名 {index + 1}
							</label>
							<Input
								value={row.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									updateRow(row.id, 'name', e.target.value)
								}
								placeholder="请输入姓名"
							/>
						</div>
						<div style={{ flex: 1 }}>
							<label
								style={{ display: 'block', marginBottom: 4, color: '#fff' }}
							>
								邮箱 {index + 1}
							</label>
							<Input
								value={row.email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									updateRow(row.id, 'email', e.target.value)
								}
								placeholder="请输入邮箱"
							/>
						</div>
						<div style={{ display: 'flex', alignItems: 'end' }}>
							<Button
								danger
								onClick={() => removeRow(row.id)}
								disabled={rows.length === 1}
							>
								删除
							</Button>
						</div>
					</motion.div>
				))}
			</div>

			<Space style={{ marginTop: 16 }}>
				<Button type="dashed" onClick={addRow}>
					添加行
				</Button>
				<Button
					type="primary"
					onClick={() => {
						message.success('动态表单提交成功！');
						console.log('动态表单数据:', rows);
					}}
				>
					提交表单
				</Button>
			</Space>

			<div
				style={{
					marginTop: 24,
					padding: 16,
					background: 'rgba(0, 212, 255, 0.1)',
					borderRadius: 8,
					border: '1px solid rgba(0, 212, 255, 0.3)',
				}}
			>
				<Title level={5} style={{ color: '#00d4ff', marginBottom: 12 }}>
					当前表单数据：
				</Title>
				<pre style={{ color: '#fff', margin: 0 }}>
					{JSON.stringify(rows, null, 2)}
				</pre>
			</div>
		</Card>
	);
};

const StateControlDemo: React.FC = () => {
	const [formDisabled, setFormDisabled] = useState(false);
	const [userType, setUserType] = useState('');

	return (
		<Card title="⚙️ 状态控制演示" className="demo-card">
			<Paragraph style={{ color: '#ccc', marginBottom: 24 }}>
				演示全局禁用状态和字段级别的状态控制能力。
			</Paragraph>

			<div style={{ marginBottom: 24 }}>
				<Space>
					<Button
						type={formDisabled ? 'default' : 'primary'}
						onClick={() => setFormDisabled(!formDisabled)}
					>
						{formDisabled ? '启用表单' : '禁用表单'}
					</Button>
					<span style={{ color: '#ccc' }}>
						当前状态: {formDisabled ? '禁用' : '启用'}
					</span>
				</Space>
			</div>

			<div className="state-control-form">
				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
						用户类型
					</label>
					<Select
						value={userType}
						onChange={setUserType}
						placeholder="请选择用户类型"
						style={{ width: '100%' }}
						disabled={formDisabled}
						options={[
							{ label: '个人用户', value: 'personal' },
							{ label: '企业用户', value: 'company' },
							{ label: '管理员', value: 'admin' },
						]}
					/>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
						用户名
					</label>
					<Input placeholder="请输入用户名" disabled={formDisabled} />
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
						公司名称
					</label>
					<Input
						placeholder="请输入公司名称"
						disabled={formDisabled || userType !== 'company'}
					/>
					{userType !== 'company' && userType && (
						<div style={{ color: '#faad14', fontSize: 12, marginTop: 4 }}>
							只有企业用户可以填写公司名称
						</div>
					)}
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
						管理员权限
					</label>
					<Select
						placeholder="请选择权限"
						style={{ width: '100%' }}
						disabled={formDisabled || userType !== 'admin'}
						options={[
							{ label: '只读权限', value: 'read' },
							{ label: '读写权限', value: 'write' },
							{ label: '超级管理员', value: 'super' },
						]}
					/>
					{userType !== 'admin' && userType && (
						<div style={{ color: '#faad14', fontSize: 12, marginTop: 4 }}>
							只有管理员可以设置权限
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

const FrameworkFeaturesDemo: React.FC = () => {
	return (
		<div
			className="framework-features-demo"
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
				padding: 24,
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				style={{ marginBottom: 32 }}
			>
				<Title
					level={1}
					style={{
						color: '#fff',
						textAlign: 'center',
						background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					Easy Page 框架特点演示
				</Title>
				<Paragraph
					style={{
						color: '#ccc',
						textAlign: 'center',
						fontSize: 16,
						maxWidth: 800,
						margin: '0 auto',
					}}
				>
					通过实际可操作的演示，体验 Easy Page 表单框架的强大功能
				</Paragraph>
			</motion.div>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={12}>
					<LinkageDemo />
				</Col>
				<Col xs={24} lg={12}>
					<StateControlDemo />
				</Col>
				<Col xs={24}>
					<DynamicFormDemo />
				</Col>
			</Row>

			<style jsx>{`
				.demo-card {
					background: rgba(255, 255, 255, 0.05) !important;
					border: 1px solid rgba(255, 255, 255, 0.1) !important;
					border-radius: 12px !important;
				}

				.demo-card .ant-card-head {
					background: transparent !important;
					border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
				}

				.demo-card .ant-card-head-title {
					color: #fff !important;
					font-size: 18px !important;
					font-weight: 600 !important;
				}

				.demo-card .ant-card-body {
					background: transparent !important;
				}
			`}</style>
		</div>
	);
};

export default FrameworkFeaturesDemo;
