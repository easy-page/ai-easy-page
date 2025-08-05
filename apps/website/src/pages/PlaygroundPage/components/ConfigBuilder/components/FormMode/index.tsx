import { FC, useState } from 'react';
import { Button, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormSchema } from '../../../../Schema';
import NodeTree from './NodeTree';
import './index.less';

interface FormModeProps {
	schema: FormSchema | null;
	onBack: () => void;
	onImport: () => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
}

const FormMode: FC<FormModeProps> = ({
	schema,
	onBack,
	onImport,
	selectedNode,
	onNodeSelect,
}) => {
	const [schemaData, setSchemaData] = useState<FormSchema | null>(schema);

	const handleAddNode = (parentId: string, nodeType: string) => {
		message.info('添加节点功能暂未实现');
	};

	const handleDeleteNode = (nodeId: string) => {
		message.info('删除节点功能暂未实现');
	};

	return (
		<div className="form-mode">
			<div className="form-mode-content">
				<Card
					title="节点树"
					className="node-tree-card"
					extra={
						<Button
							type="text"
							size="small"
							icon={<PlusOutlined />}
							onClick={() => handleAddNode('form', 'component')}
						>
							添加
						</Button>
					}
				>
					<NodeTree
						schema={schemaData}
						selectedNode={selectedNode}
						onNodeSelect={onNodeSelect}
						onAddNode={handleAddNode}
						onDeleteNode={handleDeleteNode}
					/>
				</Card>
			</div>
		</div>
	);
};

export default FormMode;
