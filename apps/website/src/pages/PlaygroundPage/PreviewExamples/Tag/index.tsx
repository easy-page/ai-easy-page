import * as React from 'react';
import { Tag, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TagExample: React.FC = () => {
	const [tags, setTags] = React.useState(['标签1', '标签2', '标签3']);

	const handleClose = (removedTag: string) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		setTags(newTags);
	};

	const addTag = () => {
		const newTag = `标签${tags.length + 1}`;
		setTags([...tags, newTag]);
	};

	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '16px' }}>
				<h4>基础标签</h4>
				<Tag>默认标签</Tag>
				<Tag color="blue">蓝色标签</Tag>
				<Tag color="green">绿色标签</Tag>
				<Tag color="red">红色标签</Tag>
				<Tag color="orange">橙色标签</Tag>
			</div>

			<div style={{ marginBottom: '16px' }}>
				<h4>可关闭标签</h4>
				{tags.map((tag) => (
					<Tag
						key={tag}
						closable
						onClose={() => handleClose(tag)}
						style={{ marginBottom: '8px' }}
					>
						{tag}
					</Tag>
				))}
				<Button
					size="small"
					type="dashed"
					onClick={addTag}
					style={{ marginLeft: '8px' }}
				>
					<PlusOutlined /> 添加标签
				</Button>
			</div>

			<div style={{ marginBottom: '16px' }}>
				<h4>不同尺寸</h4>
				<Tag>小标签</Tag>
				<Tag>默认标签</Tag>
				<Tag>大标签</Tag>
			</div>

			<div style={{ marginBottom: '16px' }}>
				<h4>状态标签</h4>
				<Tag color="success">成功</Tag>
				<Tag color="processing">处理中</Tag>
				<Tag color="error">错误</Tag>
				<Tag color="warning">警告</Tag>
				<Tag color="default">默认</Tag>
			</div>
		</div>
	);
};

export default TagExample;
