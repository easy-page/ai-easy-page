import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import {
	FolderOutlined,
	SettingOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';
import { ProjectInfo, ProjectType } from '@/apis/project';

type Props = {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	mode?: 'create' | 'edit';
	project?: ProjectInfo | null;
};

const { TextArea } = Input;
const { Option } = Select;

const CreateProjectModal: React.FC<Props> = ({
	open,
	onClose,
	onSuccess,
	mode = 'create',
	project = null,
}) => {
	const [form] = Form.useForm();
	const chatService = useService(ChatService);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);

	useEffect(() => {
		if (open) {
			form.resetFields();
			if (mode === 'edit' && project) {
				form.setFieldsValue({
					name: project.name,
					icon_url: project.icon_url,
					tags: project.tags,
				});
			} else {
				const defaultType = curTeam?.id
					? ProjectType.TEAM
					: ProjectType.PERSONAL;
				form.setFieldsValue({
					project_type: defaultType,
					team_id: curTeam?.id,
				});
			}
		}
	}, [open, curTeam, form, mode, project]);

	const handleSubmit = async (values: any) => {
		if (mode === 'edit' && project) {
			await chatService.updateExistingProject(project.id, {
				name: values.name,
				icon_url: values.icon_url,
				tags: values.tags,
			});
		} else {
			const teamId =
				values.project_type === ProjectType.TEAM ? values.team_id : null;
			await chatService.createNewProject({
				name: values.name,
				icon_url: values.icon_url,
				tags: values.tags,
				project_type: values.project_type,
				team_id: teamId,
			});
		}
		onClose();
		onSuccess?.();
	};

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<FolderOutlined /> 创建项目
				</div>
			}
			open={open}
			onOk={form.submit}
			onCancel={onClose}
			okText="创建"
			cancelText="取消"
			width={600}
		>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				{mode === 'create' && (
					<>
						<Form.Item
							name="project_type"
							label="项目类型"
							rules={[{ required: true, message: '请选择项目类型' }]}
						>
							<Select placeholder="请选择项目类型">
								<Option value={ProjectType.PERSONAL}>个人项目</Option>
								<Option value={ProjectType.TEAM}>团队项目</Option>
								<Option value={ProjectType.PUBLIC}>公共项目</Option>
							</Select>
						</Form.Item>

						<Form.Item shouldUpdate noStyle>
							{({ getFieldValue }) => {
								const type = getFieldValue('project_type');
								return type === ProjectType.TEAM ? (
									<Form.Item
										name="team_id"
										label="所属团队"
										rules={[{ required: true, message: '请选择所属团队' }]}
										initialValue={curTeam?.id}
									>
										<Select placeholder="请选择所属团队">
											{userTeams.map((team) => (
												<Option key={team.id} value={team.id}>
													<span
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: 8,
														}}
													>
														<TeamOutlined /> {team.name}
													</span>
												</Option>
											))}
										</Select>
									</Form.Item>
								) : null;
							}}
						</Form.Item>
					</>
				)}

				<Form.Item
					name="name"
					label="项目名称"
					rules={[
						{ required: true, message: '请输入项目名称' },
						{ max: 50, message: '项目名称不能超过50个字符' },
					]}
				>
					<Input
						placeholder="请输入项目名称"
						prefix={<FolderOutlined />}
						maxLength={50}
					/>
				</Form.Item>

				<Form.Item
					name="description"
					label="项目描述"
					rules={[{ max: 200, message: '项目描述不能超过200个字符' }]}
				>
					<TextArea
						placeholder="请输入项目描述（可选）"
						rows={4}
						maxLength={200}
						showCount
					/>
				</Form.Item>

				<Form.Item name="tags" label="项目标签">
					<Input
						placeholder="请输入项目标签，用逗号分隔（可选）"
						prefix={<SettingOutlined />}
					/>
				</Form.Item>

				<Form.Item name="icon_url" label="项目图标URL">
					<Input
						placeholder="请输入项目图标URL（可选）"
						prefix={<SettingOutlined />}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CreateProjectModal;
