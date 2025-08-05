import { FC } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormSchema } from '../../../../Schema';
import ConfigHeader from '../ConfigHeader';
import ConfigTips from '../ConfigTips';

const { Text } = Typography;

interface FormModeProps {
	schema: FormSchema | null;
	onBack: () => void;
	onImport: () => void;
}

const FormMode: FC<FormModeProps> = ({ schema, onBack, onImport }) => {
	return (
		<div className="config-builder">
			<ConfigHeader
				title="表单配置"
				showBack
				showImport
				onBack={onBack}
				onImport={onImport}
			/>

			<div className="config-editor">
				<div className="schema-display">
					<Text strong>当前 Schema:</Text>
					<pre
						style={{
							background: 'rgba(0, 0, 0, 0.1)',
							padding: '12px',
							borderRadius: '6px',
							fontSize: '12px',
							overflow: 'auto',
							maxHeight: '200px',
						}}
					>
						{JSON.stringify(schema, null, 2)}
					</pre>
				</div>
			</div>

			<div className="config-actions">
				<Space>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => message.info('添加字段功能暂未实现')}
					>
						添加字段
					</Button>
					<Button onClick={() => message.info('导出配置功能暂未实现')}>
						导出配置
					</Button>
				</Space>
			</div>

			<ConfigTips
				title="表单配置说明"
				tips={[
					'当前已创建基础表单结构',
					'表单包含默认的提交和值变化处理',
					'可在右侧预览区域查看渲染效果',
					'后续可扩展更多字段和组件',
				]}
			/>
		</div>
	);
};

export default FormMode;
