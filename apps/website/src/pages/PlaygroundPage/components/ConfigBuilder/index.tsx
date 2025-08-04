import { FC } from 'react';
import { Button } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

const ConfigBuilder: FC = () => {
	return (
		<div className="config-builder">
			<div className="config-header">
				<h3>表单配置</h3>
				<Button type="primary" size="small" icon={<CodeOutlined />}>
					导入配置
				</Button>
			</div>

			<div className="config-editor">
				<div
					style={{
						height: '300px',
						background: 'rgba(0, 0, 0, 0.3)',
						border: '1px solid rgba(0, 255, 255, 0.2)',
						borderRadius: '12px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'rgba(255, 255, 255, 0.6)',
						fontSize: '14px',
					}}
				>
					代码编辑器区域
				</div>
			</div>

			<div className="config-tips">
				<h4>配置提示</h4>
				<ul>
					<li>支持 JSON 格式的表单配置</li>
					<li>可以配置字段类型、验证规则、布局等</li>
					<li>实时预览配置效果</li>
					<li>支持导入/导出配置文件</li>
				</ul>
			</div>
		</div>
	);
};

export default ConfigBuilder;
