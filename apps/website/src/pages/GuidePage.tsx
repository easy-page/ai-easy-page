import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import CoreConcepts from './guide/CoreConcepts';
import Basics from './guide/Basics';
import Advanced from './guide/Advanced';
import FrameworkFeatures from './guide/core-concepts/FrameworkFeatures';

const GuidePage: React.FC = () => {
	return (
		<PageContainer
			title="指南"
			subtitle="学习如何使用 Easy Page 构建强大的动态表单"
		>
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
