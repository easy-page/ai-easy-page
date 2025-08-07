import Code from '../CodeOfSemi';
import './index.less';
import * as semiUi from '@douyinfe/semi-ui';
import * as react from 'react';

import classNames from 'classnames';
import { MarkdownRender } from '@douyinfe/semi-ui';

import React from 'react';
import { cn } from '../../baseUi/utils';

// MDX 转义预处理函数
const preprocessMDXContent = (content: string): string => {
	// 如果内容为空，直接返回
	if (!content) return content;

	// 定义需要转义的 JSX 符号
	const escapeMap = [
		{ from: '<', to: '\\<' },
		{ from: '{', to: '\\{' },
		{ from: '}', to: '\\}' },
		{ from: '>', to: '\\>' },
	];

	let processedContent = content;

	// 保护代码块，避免转义代码块内的符号
	const codeBlockRegex = /```[\s\S]*?```/g;
	const codeBlocks: string[] = [];
	let codeBlockIndex = 0;

	// 临时替换代码块
	processedContent = processedContent.replace(codeBlockRegex, (match) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlockIndex++}__`;
	});

	// 保护行内代码，避免转义行内代码内的符号
	const inlineCodeRegex = /`[^`]+`/g;
	const inlineCodes: string[] = [];
	let inlineCodeIndex = 0;

	// 临时替换行内代码
	processedContent = processedContent.replace(inlineCodeRegex, (match) => {
		inlineCodes.push(match);
		return `__INLINE_CODE_${inlineCodeIndex++}__`;
	});

	// 保护 MDX 组件标签，避免转义真正的组件
	// 匹配 <ComponentName 或 <ComponentName/> 或 <ComponentName> 的模式
	const mdxComponentRegex =
		/<[A-Z][a-zA-Z0-9]*(\s+[^>]*)?\/?>|<[A-Z][a-zA-Z0-9]*(\s+[^>]*)?>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g;
	const mdxComponents: string[] = [];
	let mdxComponentIndex = 0;

	// 临时替换 MDX 组件
	processedContent = processedContent.replace(mdxComponentRegex, (match) => {
		mdxComponents.push(match);
		return `__MDX_COMPONENT_${mdxComponentIndex++}__`;
	});

	// 转义 JSX 符号（只在非代码区域和非组件区域）
	escapeMap.forEach(({ from, to }) => {
		processedContent = processedContent.replace(
			new RegExp(`\\${from}`, 'g'),
			to
		);
	});

	// 恢复 MDX 组件
	mdxComponents.forEach((component, index) => {
		processedContent = processedContent.replace(
			`__MDX_COMPONENT_${index}__`,
			component
		);
	});

	// 恢复代码块
	codeBlocks.forEach((codeBlock, index) => {
		processedContent = processedContent.replace(
			`__CODE_BLOCK_${index}__`,
			codeBlock
		);
	});

	// 恢复行内代码
	inlineCodes.forEach((inlineCode, index) => {
		processedContent = processedContent.replace(
			`__INLINE_CODE_${index}__`,
			inlineCode
		);
	});

	return processedContent;
};

const customTdRender = (text: string) => {
	const [isModalVisible, setIsModalVisible] = react.useState(false);

	const openModal = () => {
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	if (text.length > 20) {
		const truncatedText = '查看完整信息';
		return (
			<div>
				<div>{text.substring(0, 20) + '...'}</div>
				<div
					style={{ color: 'rgb(22, 119, 255)', cursor: 'pointer' }}
					onClick={openModal}
				>
					{truncatedText}
				</div>
				<semiUi.Modal
					title="完整信息"
					visible={isModalVisible}
					onOk={closeModal}
					onCancel={closeModal}
				>
					<p style={{ whiteSpace: 'pre' }}>{text.split('。').join('\n')}</p>
				</semiUi.Modal>
			</div>
		);
	}
	return text;
};

const renderTable = ({ tableChildren }: any) => {
	const headers: any[] = [];
	const rows: any[] = [];
	const [currentPage, setCurrentPage] = react.useState(1);
	const itemsPerPage = 10;

	React.Children.forEach(tableChildren, (child) => {
		if (child && child.type === 'thead') {
			React.Children.forEach(child.props.children, (tr) => {
				if (tr && tr.type === 'tr') {
					React.Children.forEach(tr.props.children, (th) => {
						if (th && th.type === 'th') {
							headers.push(th.props.children);
						}
					});
				}
			});
		} else if (child && child.type === 'tbody') {
			React.Children.forEach(child.props.children, (tr) => {
				if (tr && tr.type === 'tr') {
					const rowData: any[] = [];
					React.Children.forEach(tr.props.children, (td) => {
						if (td && td.type === 'td') {
							rowData.push(td.props.children);
						}
					});
					rows.push(rowData);
				}
			});
		}
	});

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(rows.length / itemsPerPage);
	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className="overflow-hidden overflow-x-auto">
			<table
				className="semi-table-thead min-w-[700px]"
				style={{ width: '100%' }}
			>
				<thead className="semi-table-thead">
					<tr className="semi-table-row">
						{headers.map((header, index) => (
							<th key={index} className="semi-table-row-head">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="semi-table-tbody">
					{currentItems.map((row, rowIndex) => (
						<tr key={rowIndex} className="semi-table-row">
							{row.map((cell: any, cellIndex: number) => (
								<td
									key={cellIndex}
									className="semi-table-row-cell"
									style={{ fontSize: '14px' }}
								>
									{customTdRender(cell)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{totalPages > 1 && (
				<div className="pagination-container">
					<span style={{ fontSize: '13px', color: '#222' }}>
						每页10条&nbsp;&nbsp;共{pageNumbers.length}页
					</span>
					{pageNumbers.map((number) => (
						<button
							key={number}
							onClick={() => handlePageChange(number)}
							className={`pagination-button ${
								number === currentPage ? 'active' : ''
							}`}
						>
							{number}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const getComponent = (
	componentName: string,
	presetComponents: Record<string, React.FC<any>>
) => {
	const componentNames = componentName.split('.');
	if (componentNames.length === 1) {
		return (semiUi as any)[componentName] || presetComponents[componentName];
	}

	if (componentNames.length === 2) {
		const [namespace, name] = componentNames;
		return (
			(semiUi as any)[namespace]?.[name] || presetComponents[componentName]
		);
	}

	return presetComponents[componentName];
};

export const MarkdownRenderer = ({
	messageId,
	content,
	isStreaming = false,
	presetComponents = {},
}: {
	messageId?: string;
	content: string;
	applied?: boolean;
	presetComponents?: Record<string, React.FC<any>>;
	isStreaming?: boolean;
}) => {
	const components: any = react.useMemo(() => {
		const components: any = {};

		components['code'] = (props: any) => (
			<Code isStreaming={isStreaming} {...props} />
		);
		components['h1'] = ({ className, ...props }: any) => (
			<h1
				className={classNames(
					'mb-4 scroll-m-20 text-3xl font-extrabold tracking-tight last:mb-0',
					className
				)}
				{...props}
			/>
		);
		components['h2'] = ({ className, ...props }: any) => (
			<h2
				className={classNames(
					'mb-4 mt-4 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);
		components['h3'] = ({ className, ...props }: any) => (
			<h3
				className={classNames(
					'my-4 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);
		components['h4'] = ({ className, ...props }: any) => (
			<h4
				className={classNames(
					'my-2 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);
		components['h5'] = ({ className, ...props }: any) => (
			<h5
				className={classNames(
					'my-2 text-base font-semibold first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);
		components['h6'] = ({ className, ...props }: any) => (
			<h6
				className={classNames(
					'my-2 font-semibold first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);

		components['p'] = ({ className, ...props }: any) => (
			<p
				className={classNames(
					'mb-1 mt-1 text-sm leading-7 break-words first:mt-0 last:mb-0',
					className
				)}
				{...props}
			/>
		);

		components['ul'] = ({ className, ...props }: any) => (
			<ul
				className={classNames(
					'my-2 ml-6 text-sm  list-disc [&>li]:mt-2',
					className
				)}
				{...props}
			/>
		);

		components['hr'] = ({ className, ...props }: any) => {
			return (
				<hr className={classNames('my-2 border-b', className)} {...props} />
			);
		};

		components['ol'] = ({ className, ...props }: any) => (
			<ol
				className={classNames(
					'my-2 ml-6 text-sm  list-decimal [&>li]:mt-2',
					className
				)}
				{...props}
			/>
		);

		components['table'] = ({ className, children, ...props }: any) => {
			try {
				return renderTable({ tableChildren: children });
			} catch (error) {
				return (
					<p
						className={cn(
							'mb-1 mt-1 text-sm leading-7 first:mt-0 last:mb-0',
							className
						)}
						{...props}
					>
						{children}
					</p>
				);
			}
		};

		components['ErrorMessage'] = (props: {
			className?: string;
			componentName: string;
			componentProps: Record<string, any>;
			defaultValue?: string;
			children?: React.ReactNode;
			error?: string;
		}) => {
			console.log('componentProps', props);

			return (
				<div style={{ color: '#dc2626' }}>
					{props?.error || '请求失败，请稍后重试'}
				</div>
			);
		};
		Object.keys(semiUi).map((e) => {
			const component = getComponent(e, presetComponents);
			if (e === 'Input') {
				console.log('component', e, component);
			}
			if (component) {
				components[e] = component;
			}
		});
		Object.keys(presetComponents).map((e) => {
			const component = getComponent(e, presetComponents);
			if (component) {
				components[e] = component;
			}
		});
		return components;
	}, []);

	// return <>{transformedContent}</>;

	// if (!isStream) {
	// }
	// console.log('isStreaming1232133121', content);
	// 如果设置成这样，卡片就展示不出来了 format={isStreaming ? 'md' : 'mdx'}

	// 预处理 MDX 内容，转义未转义的 JSX 符号
	const processedContent = preprocessMDXContent(content);

	return <MarkdownRender components={components} raw={processedContent} />;
};
