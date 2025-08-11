import React from 'react';
import { Form, FormItem, useRouteParams, RouteParamsAction } from '../index';

/**
 * 路由参数管理示例
 * 演示如何使用路由参数管理功能
 */
export const RouteParamsExample: React.FC = () => {
	return (
		<div>
			<h2>路由参数管理示例</h2>
			<Form initialRouteParams={{ page: '1', size: '10' }}>
				<RouteParamsDisplay />
				<RouteParamsControls />
				<RouteParamsEventMonitor />
				<FormContent />
			</Form>
		</div>
	);
};

/**
 * 路由参数显示组件
 */
const RouteParamsDisplay: React.FC = () => {
	const { routeParams, buildQueryString } = useRouteParams();

	return (
		<div
			style={{
				marginBottom: '20px',
				padding: '10px',
				border: '1px solid #ccc',
			}}
		>
			<h3>当前路由参数</h3>
			<pre>{JSON.stringify(routeParams, null, 2)}</pre>
			<p>查询字符串: {buildQueryString()}</p>
		</div>
	);
};

/**
 * 路由参数变化事件监控组件
 */
const RouteParamsEventMonitor: React.FC = () => {
	const { lastChangeEvent } = useRouteParams();

	// 获取动作的中文描述
	const getActionDescription = (action: RouteParamsAction): string => {
		switch (action) {
			case RouteParamsAction.SET:
				return '设置单个参数';
			case RouteParamsAction.BATCH_SET:
				return '批量设置参数';
			case RouteParamsAction.REMOVE:
				return '移除单个参数';
			case RouteParamsAction.UPDATE:
				return '更新参数（合并）';
			case RouteParamsAction.CLEAR:
				return '清空所有参数';
			case RouteParamsAction.RESET:
				return '重置到初始状态';
			case RouteParamsAction.PARSE:
				return '从URL解析';
			default:
				return '未知动作';
		}
	};

	return (
		<div
			style={{
				marginBottom: '20px',
				padding: '10px',
				border: '1px solid #ddd',
				backgroundColor: '#f9f9f9',
			}}
		>
			<h3>路由参数变化事件监控</h3>
			{lastChangeEvent ? (
				<div>
					<p><strong>动作:</strong> {lastChangeEvent.action} ({getActionDescription(lastChangeEvent.action)})</p>
					{lastChangeEvent.key && (
						<p><strong>操作键:</strong> {lastChangeEvent.key}</p>
					)}
					{lastChangeEvent.value && (
						<p><strong>设置值:</strong> {lastChangeEvent.value}</p>
					)}
					{lastChangeEvent.params && (
						<div>
							<p><strong>批量参数:</strong></p>
							<pre>{JSON.stringify(lastChangeEvent.params, null, 2)}</pre>
						</div>
					)}
					<div>
						<p><strong>变化前:</strong></p>
						<pre>{JSON.stringify(lastChangeEvent.previousParams, null, 2)}</pre>
					</div>
					<div>
						<p><strong>变化后:</strong></p>
						<pre>{JSON.stringify(lastChangeEvent.currentParams, null, 2)}</pre>
					</div>
				</div>
			) : (
				<p>暂无变化事件</p>
			)}
		</div>
	);
};

/**
 * 路由参数控制组件
 */
const RouteParamsControls: React.FC = () => {
	const {
		setRouteParam,
		removeRouteParam,
		updateRouteParams,
		clearRouteParams,
		updateBrowserUrl,
		resetRouteParams,
	} = useRouteParams();

	return (
		<div
			style={{
				marginBottom: '20px',
				padding: '10px',
				border: '1px solid #ccc',
			}}
		>
			<h3>路由参数控制</h3>
			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => setRouteParam('page', '1')}>设置 page=1</button>
				<button onClick={() => setRouteParam('size', '20')}>
					设置 size=20
				</button>
				<button onClick={() => setRouteParam('search', 'test')}>
					设置 search=test
				</button>
				<button onClick={() => removeRouteParam('search')}>
					移除 search 参数
				</button>
				<button onClick={() => updateRouteParams({ page: '2', size: '15' })}>
					更新多个参数
				</button>
				<button onClick={() => updateBrowserUrl()}>更新浏览器URL</button>
				<button onClick={() => clearRouteParams()}>清空所有参数</button>
				<button onClick={() => resetRouteParams()}>重置参数</button>
			</div>
		</div>
	);
};

/**
 * 表单内容组件
 */
const FormContent: React.FC = () => {
	const { getRouteParam, setRouteParam } = useRouteParams();

	return (
		<div>
			<h3>表单内容</h3>
			<FormItem id="name" label="姓名">
				<input
					type="text"
					placeholder="请输入姓名"
					onChange={(e) => {
						// 当输入变化时，同时更新路由参数
						setRouteParam('name', e.target.value);
					}}
				/>
			</FormItem>

			<FormItem id="email" label="邮箱">
				<input
					type="email"
					placeholder="请输入邮箱"
					onChange={(e) => {
						setRouteParam('email', e.target.value);
					}}
				/>
			</FormItem>

			<div style={{ marginTop: '20px' }}>
				<p>当前路由参数中的姓名: {getRouteParam('name') || '未设置'}</p>
				<p>当前路由参数中的邮箱: {getRouteParam('email') || '未设置'}</p>
			</div>
		</div>
	);
};
