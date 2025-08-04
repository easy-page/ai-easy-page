import React, { useState } from 'react';
import { Button, Space, Card, Radio } from 'antd';
import { Form, FormItem, FormStore, RowInfo } from '@easy-page/core';
import {
	Input,
	Select,
	TextArea,
	Checkbox,
	CheckboxGroup,
	RadioGroup,
	DatePicker,
	DateRangePicker,
	TimePicker,
	Container,
} from '@easy-page/pc';

export const FullFormDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('基础表单提交:', values);
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		console.log('值变化:', changedValues, allValues);
	};

	return (
		<Form
			initialValues={{
				username: '',
				email: '',
				age: 18,
				city: '',
				description: '',
				agreement: false,
				hobbies: [],
				gender: '',
				birthday: '',
				noLabelField: '',
				phone: '',
				website: '',
			}}
			onSubmit={handleSubmit}
			onValuesChange={handleValuesChange}
		>
			<Container
				title="基础信息"
				titleType="h1"
				containerType="Card"
				show={() => true}
			>
				<FormItem
					id="username"
					label="用户名"
					required
					help="用户名将用于登录，建议使用英文和数字组合"
					validate={[
						{ required: true, message: '请输入用户名' },
						{ min: 2, message: '用户名至少2个字符' },
					]}
				>
					<Input placeholder="请输入用户名" />
				</FormItem>

				<FormItem
					id="email"
					label="邮箱"
					required
					validate={[
						{ required: true, message: '请输入邮箱' },
						{
							pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: '邮箱格式不正确',
						},
					]}
				>
					<Input placeholder="请输入邮箱" />
				</FormItem>

				<FormItem
					id="phone"
					label="手机号"
					help="手机号将用于接收验证码和重要通知"
					validate={[
						{
							pattern: /^1[3-9]\d{9}$/,
							message: '手机号格式不正确',
						},
					]}
				>
					<Input placeholder="请输入手机号" />
				</FormItem>

				<FormItem
					id="age"
					label="年龄"
					validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
				>
					<Input type="number" placeholder="请输入年龄" />
				</FormItem>

				<FormItem
					id="city"
					label="城市"
					help="选择您所在的城市，将为您推荐相关内容"
				>
					<Select
						placeholder="请选择城市"
						options={[
							{ label: '北京', value: 'beijing' },
							{ label: '上海', value: 'shanghai' },
							{ label: '广州', value: 'guangzhou' },
							{ label: '深圳', value: 'shenzhen' },
						]}
					/>
				</FormItem>

				<FormItem id="description" label="个人描述">
					<TextArea
						placeholder="请输入个人描述"
						rows={4}
						showCount
						maxLength={200}
					/>
				</FormItem>

				<FormItem
					id="birthday"
					label="生日"
					help="生日将用于个性化推荐和生日祝福"
				>
					<DatePicker placeholder="请选择生日" />
				</FormItem>

				<FormItem id="workTime" label="工作时间" help="选择您的工作时间段">
					<TimePicker placeholder="请选择时间" format="HH:mm" />
				</FormItem>

				<FormItem
					id="vacationRange"
					label="假期范围"
					help="选择您的假期开始和结束日期"
				>
					<DateRangePicker
						placeholder={['开始日期', '结束日期']}
						showTime={false}
					/>
				</FormItem>

				<FormItem
					id="meetingTime"
					label="会议时间"
					help="选择会议的具体日期和时间"
				>
					<DatePicker
						placeholder="请选择会议时间"
						showTime={true}
						format="YYYY-MM-DD HH:mm:ss"
					/>
				</FormItem>

				<FormItem
					id="projectPeriod"
					label="项目周期"
					help="选择项目的开始和结束时间"
				>
					<DateRangePicker
						placeholder={['项目开始', '项目结束']}
						showTime={true}
						format="YYYY-MM-DD HH:mm:ss"
					/>
				</FormItem>

				<FormItem id="gender" label="性别">
					<RadioGroup
						options={[
							{ label: '男', value: 'male' },
							{ label: '女', value: 'female' },
							{ label: '其他', value: 'other' },
						]}
					/>
				</FormItem>

				<FormItem id="hobbies" label="兴趣爱好">
					<CheckboxGroup
						options={[
							{ label: '阅读', value: 'reading' },
							{ label: '音乐', value: 'music' },
							{ label: '运动', value: 'sports' },
							{ label: '旅行', value: 'travel' },
							{ label: '美食', value: 'food' },
						]}
					/>
				</FormItem>

				<FormItem
					id="website"
					label="个人网站"
					help="可选填，用于展示您的个人作品或博客"
					tips="请确保网站可以正常访问"
				>
					<Input placeholder="请输入个人网站地址" />
				</FormItem>

				<FormItem id="agreement" label="" noLabel>
					<Checkbox>我已阅读并同意用户协议和隐私政策</Checkbox>
				</FormItem>

				<FormItem id="noLabelField" label="" noLabel>
					<Input placeholder="无标签字段示例" />
				</FormItem>
			</Container>
			<Space>
				<Button type="primary" htmlType="submit">
					提交
				</Button>
				<Button>重置</Button>
			</Space>
		</Form>
	);
};
