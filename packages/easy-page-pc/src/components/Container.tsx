import React from 'react';
import { Card } from 'antd';
import { When, WhenProps } from '@easy-page/core';

// 容器类型
export type ContainerType = 'Card' | 'Bordered';

// 布局类型
export type LayoutType = 'horizontal' | 'vertical';

// 标题类型
export type TitleType = 'h1' | 'h2' | 'h3' | 'h4';

// 容器组件的 props 类型定义
export interface ContainerProps extends Omit<WhenProps, 'children'> {
	containerType?: ContainerType;
	layout?: LayoutType;
	customContainer?: (props: { children: React.ReactNode }) => React.ReactNode;
	title?: React.ReactNode;
	titleType?: TitleType;
	children: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
}

// 标题样式配置（不设置固定颜色，颜色在 render 阶段按容器类型覆盖）
const titleStyles: Record<TitleType, React.CSSProperties> = {
	h1: {
		fontSize: '24px',
		fontWeight: 'bold',
		marginBottom: '16px',
	},
	h2: {
		fontSize: '20px',
		fontWeight: '600',
		marginBottom: '12px',
		position: 'relative',
		paddingLeft: '12px',
	},
	h3: {
		fontSize: '16px',
		fontWeight: '600',
		marginBottom: '8px',
	},
	h4: {
		fontSize: '14px',
		fontWeight: '500',
		marginBottom: '6px',
	},
};

// 容器组件实现
export const Container: React.FC<ContainerProps> = ({
	containerType = 'Card',
	layout = 'vertical',
	customContainer,
	title,
	titleType = 'h2',
	children,
	style,
	className,
	...whenProps
}) => {
	// 渲染标题
	const renderTitle = () => {
		if (!title) return null;

		// 在深色背景下（如 Playground 预览卡片）希望标题继承父级颜色；
		// 在浅色白底容器（Bordered）下强制使用深色标题。
		const titleStyle: React.CSSProperties = {
			...titleStyles[titleType],
			color: containerType === 'Bordered' ? '#262626' : 'inherit',
		};

		// 二级标题特殊处理：添加左侧竖线
		if (titleType === 'h2') {
			return (
				<div style={titleStyle}>
					<div
						style={{
							position: 'absolute',
							left: 0,
							top: '50%',
							transform: 'translateY(-50%)',
							width: '4px',
							height: '16px',
							backgroundColor: '#1890ff',
							borderRadius: '2px',
						}}
					/>
					{title}
				</div>
			);
		}

		return <div style={titleStyle}>{title}</div>;
	};

	// 渲染内容
	const renderContent = () => {
		const contentStyle: React.CSSProperties = {
			display: 'flex',
			gap: '16px',
			...(layout === 'vertical' && {
				flexDirection: 'column',
			}),
			...(layout === 'horizontal' && {
				flexDirection: 'row',
				alignItems: 'flex-start',
			}),
		};

		return <div style={contentStyle}>{children}</div>;
	};

	// 渲染容器
	const renderContainer = () => {
		const containerContent = (
			<>
				{renderTitle()}
				{renderContent()}
			</>
		);

		// 如果提供了自定义容器，使用自定义容器
		if (customContainer) {
			return customContainer({ children: containerContent });
		}

		// 根据容器类型渲染不同的容器
		switch (containerType) {
			case 'Card':
				return (
					<Card
						style={style}
						className={className}
						bodyStyle={{ padding: '16px' }}
					>
						{containerContent}
					</Card>
				);
			case 'Bordered':
				return (
					<div
						style={{
							border: '1px solid #f0f0f0',
							borderRadius: '6px',
							padding: '16px',
							backgroundColor: '#fff',
							...style,
						}}
						className={className}
					>
						{containerContent}
					</div>
				);
			default:
				return (
					<div style={style} className={className}>
						{containerContent}
					</div>
				);
		}
	};

	// 使用 When 组件包装，实现条件渲染
	return <When {...whenProps}>{renderContainer()}</When>;
};

export default Container;
