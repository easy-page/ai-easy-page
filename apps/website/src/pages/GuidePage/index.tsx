import { useMemo, FC } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import CoreConcepts from '../guide/CoreConcepts';
import Basics from '../guide/Basics';
import Advanced from '../guide/Advanced';
import FrameworkFeatures from '../guide/core-concepts/FrameworkFeatures';

const GuidePage: FC = () => {
	const location = useLocation();

	// 根据当前路径动态设置标题和描述
	const { title, subtitle } = useMemo(() => {
		const path = location.pathname;

		// 框架特点页面
		if (path.includes('/core-concepts/framework-features')) {
			return {
				title: '框架特点',
				subtitle:
					'Easy Page 表单框架的 8 大核心特点，每个特点都经过精心设计，为开发者提供强大而灵活的表单解决方案',
			};
		}

		// 设计理念页面
		if (path.includes('/core-concepts/design-philosophy')) {
			return {
				title: '设计理念',
				subtitle: '了解 Easy Page 的核心设计思想和架构原则',
			};
		}

		// 整体架构页面
		if (path.includes('/core-concepts/architecture')) {
			return {
				title: '整体架构',
				subtitle: 'Easy Page 的技术架构和模块组织方式',
			};
		}

		// 核心概念页面
		if (path.includes('/core-concepts')) {
			return {
				title: '核心概念',
				subtitle: '掌握 Easy Page 的基本概念和核心思想',
			};
		}

		// 基本使用页面
		if (path.includes('/basics/basic-usage')) {
			return {
				title: '基本使用',
				subtitle: '快速上手 Easy Page，学习基础用法',
			};
		}

		// 字段完整能力页面
		if (path.includes('/basics/field-capabilities')) {
			return {
				title: '字段完整能力',
				subtitle: '深入了解表单字段的完整功能和配置选项',
			};
		}

		// 常用组件页面
		if (path.includes('/basics/common-components')) {
			return {
				title: '常用组件',
				subtitle: '掌握 Easy Page 提供的常用表单组件',
			};
		}

		// 组件扩展页面
		if (path.includes('/basics/component-extension')) {
			return {
				title: '组件扩展',
				subtitle: '学习如何扩展和自定义表单组件',
			};
		}

		// 基础页面
		if (path.includes('/basics')) {
			return {
				title: '基础',
				subtitle: '学习 Easy Page 的基础知识和常用功能',
			};
		}

		// 联动页面
		if (path.includes('/advanced/linkage')) {
			return {
				title: '联动',
				subtitle: '掌握复杂的表单字段联动功能',
			};
		}

		// 校验页面
		if (path.includes('/advanced/validation')) {
			return {
				title: '校验',
				subtitle: '学习表单验证和校验规则的使用',
			};
		}

		// 请求管理页面
		if (path.includes('/advanced/request-management')) {
			return {
				title: '请求管理',
				subtitle: '了解表单中的异步请求管理和状态控制',
			};
		}

		// 动态表单页面
		if (path.includes('/advanced/dynamic-form')) {
			return {
				title: '动态表单',
				subtitle: '构建复杂的动态表单和自适应布局',
			};
		}

		// 进阶页面
		if (path.includes('/advanced')) {
			return {
				title: '进阶',
				subtitle: '深入学习 Easy Page 的高级功能和最佳实践',
			};
		}

		// 默认指南页面
		return {
			title: '指南',
			subtitle: '学习如何使用 Easy Page 构建强大的动态表单',
		};
	}, [location.pathname]);

	return (
		<PageContainer title={title} subtitle={subtitle}>
			<Routes>
				{/* 核心概念路由 */}
				<Route path="core-concepts" element={<CoreConcepts />} />
				<Route
					path="core-concepts/framework-features"
					element={<FrameworkFeatures />}
				/>
				<Route
					path="core-concepts/design-philosophy"
					element={<div>设计理念</div>}
				/>
				<Route
					path="core-concepts/architecture"
					element={<div>整体架构</div>}
				/>

				{/* 基础路由 */}
				<Route path="basics" element={<Basics />} />
				<Route path="basics/basic-usage" element={<div>基本使用</div>} />
				<Route
					path="basics/field-capabilities"
					element={<div>字段完整能力</div>}
				/>
				<Route path="basics/common-components" element={<div>常用组件</div>} />
				<Route
					path="basics/component-extension"
					element={<div>组件扩展</div>}
				/>

				{/* 进阶路由 */}
				<Route path="advanced" element={<Advanced />} />
				<Route path="advanced/linkage" element={<div>联动</div>} />
				<Route path="advanced/validation" element={<div>校验</div>} />
				<Route
					path="advanced/request-management"
					element={<div>请求管理</div>}
				/>
				<Route path="advanced/dynamic-form" element={<div>动态表单</div>} />

				{/* 默认路由 */}
				<Route index element={<CoreConcepts />} />
			</Routes>
		</PageContainer>
	);
};

export default GuidePage;
