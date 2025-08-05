import React, { FC } from 'react';
import {
	Form,
	Input,
	Switch,
	Select,
	InputNumber,
	Row,
	Col,
	Typography,
	Divider,
	Space,
	Button,
} from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { FormItemProps } from '../../../Schema/formItem';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface FormItemConfigPanelProps {
	props: FormItemProps;
	onChange: (props: FormItemProps) => void;
}

const FormItemConfigPanel: FC<FormItemConfigPanelProps> = ({
	props,
	onChange,
}) => {
	const [form] = Form.useForm();

	const handleValuesChange = (changedValues: any, allValues: any) => {
		onChange(allValues);
	};

	return (
		<div className="form-item-properties">
			<Title level={5}>表单项属性</Title>

			<Form
				form={form}
				layout="vertical"
				initialValues={props}
				onValuesChange={handleValuesChange}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label="字段ID" name="id">
							<Input placeholder="请输入字段ID" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="标签" name="label">
							<Input placeholder="请输入标签文本" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="必填" name="required" valuePropName="checked">
							<Switch />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="禁用" name="disabled" valuePropName="checked">
							<Switch />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="隐藏" name="hidden" valuePropName="checked">
							<Switch />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="隐藏标签" name="noLabel" valuePropName="checked">
							<Switch />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="标签布局" name="labelLayout">
							<Select>
								<Option value="vertical">垂直</Option>
								<Option value="horizontal">水平</Option>
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="标签宽度" name="labelWidth">
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="提示信息" name="tips">
							<TextArea rows={2} placeholder="请输入提示信息" />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="帮助信息" name="help">
							<TextArea rows={2} placeholder="请输入帮助信息" />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="额外信息" name="extra">
							<TextArea rows={2} placeholder="请输入额外信息" />
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Title level={5}>验证规则</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="验证规则">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={JSON.stringify(props.validate || [], null, 2)}
									language="json"
									height="120px"
									onChange={(value: string) => {
										try {
											const validate = JSON.parse(value);
											onChange({ ...props, validate });
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="验证效果">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={JSON.stringify(props.validateEffects || [], null, 2)}
									language="json"
									height="120px"
									onChange={(value: string) => {
										try {
											const validateEffects = JSON.parse(value);
											onChange({ ...props, validateEffects });
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Title level={5}>效果和动作</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="效果配置">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={JSON.stringify(props.effects || [], null, 2)}
									language="json"
									height="120px"
									onChange={(value: string) => {
										try {
											const effects = JSON.parse(value);
											onChange({ ...props, effects });
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="动作配置">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={JSON.stringify(props.actions || [], null, 2)}
									language="json"
									height="120px"
									onChange={(value: string) => {
										try {
											const actions = JSON.parse(value);
											onChange({ ...props, actions });
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Title level={5}>请求配置</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="字段请求配置">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={JSON.stringify(props.req || {}, null, 2)}
									language="json"
									height="120px"
									onChange={(value: string) => {
										try {
											const req = JSON.parse(value);
											onChange({ ...props, req });
										} catch (error) {
											// 解析错误时不更新
										}
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Title level={5}>事件处理</Title>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="值变化处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={props.onChange?.content || ''}
									language="javascript"
									height="80px"
									onChange={(value: string) => {
										onChange({
											...props,
											onChange: { type: 'function', content: value },
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="失焦处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={props.onBlur?.content || ''}
									language="javascript"
									height="80px"
									onChange={(value: string) => {
										onChange({
											...props,
											onBlur: { type: 'function', content: value },
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label="聚焦处理">
							<Space direction="vertical" style={{ width: '100%' }}>
								<MonacoEditor
									value={props.onFocus?.content || ''}
									language="javascript"
									height="80px"
									onChange={(value: string) => {
										onChange({
											...props,
											onFocus: { type: 'function', content: value },
										});
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<RobotOutlined />}
									onClick={() => {
										// AI编辑功能暂未实现
									}}
								>
									AI 编辑
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default FormItemConfigPanel;
