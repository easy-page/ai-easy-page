import * as React from 'react';

import type { ComponentMap, ComponentRegistration } from './types';
import { DEFAULT_COMPONENT_MAP } from '../constant/componentMap';

// 组件映射器类
export class ComponentMapper {
	private componentMap: ComponentMap;
	private registrations: Map<string, ComponentRegistration>;

	constructor(initialMap: ComponentMap = {}) {
		this.componentMap = { ...DEFAULT_COMPONENT_MAP, ...initialMap };
		this.registrations = new Map();

		// 初始化注册信息
		this.initializeRegistrations();
	}

	// 初始化组件注册信息
	private initializeRegistrations(): void {
		Object.entries(this.componentMap).forEach(([name, component]) => {
			this.registrations.set(name, {
				name,
				component,
				category: this.getComponentCategory(name),
			});
		});
	}

	// 获取组件分类
	private getComponentCategory(name: string): string {
		if (name.includes('Outlined')) return 'icons';
		if (['Title', 'Paragraph', 'Text'].includes(name)) return 'typography';
		if (['Option', 'TabPane', 'Step', 'Item', 'BreadcrumbItem'].includes(name))
			return 'sub-components';
		return 'components';
	}

	// 注册组件
	register(registration: ComponentRegistration): void {
		const { name, component } = registration;
		this.componentMap[name] = component;
		this.registrations.set(name, registration);
	}

	// 批量注册组件
	registerBatch(registrations: ComponentRegistration[]): void {
		registrations.forEach((registration) => this.register(registration));
	}

	// 注销组件
	unregister(name: string): boolean {
		const exists = this.componentMap.hasOwnProperty(name);
		if (exists) {
			delete this.componentMap[name];
			this.registrations.delete(name);
		}
		return exists;
	}

	// 获取组件
	getComponent(name: string): React.ComponentType<any> | undefined {
		return this.componentMap[name];
	}

	// 检查组件是否存在
	hasComponent(name: string): boolean {
		return this.componentMap.hasOwnProperty(name);
	}

	// 获取所有组件名称
	getComponentNames(): string[] {
		return Object.keys(this.componentMap);
	}

	// 获取组件注册信息
	getRegistration(name: string): ComponentRegistration | undefined {
		return this.registrations.get(name);
	}

	// 获取所有注册信息
	getAllRegistrations(): ComponentRegistration[] {
		return Array.from(this.registrations.values());
	}

	// 按分类获取组件
	getComponentsByCategory(category: string): ComponentRegistration[] {
		return this.getAllRegistrations().filter(
			(reg) => reg.category === category
		);
	}

	// 获取所有分类
	getCategories(): string[] {
		const categories = new Set<string>();
		this.getAllRegistrations().forEach((reg) => {
			if (reg.category) categories.add(reg.category);
		});
		return Array.from(categories);
	}

	// 清空所有组件
	clear(): void {
		this.componentMap = {};
		this.registrations.clear();
	}

	// 重置为默认组件
	reset(): void {
		this.componentMap = { ...DEFAULT_COMPONENT_MAP };
		this.registrations.clear();
		this.initializeRegistrations();
	}

	// 获取组件映射表副本
	getComponentMap(): ComponentMap {
		return { ...this.componentMap };
	}

	// 合并组件映射表
	merge(componentMap: ComponentMap): void {
		this.componentMap = { ...this.componentMap, ...componentMap };
		Object.entries(componentMap).forEach(([name, component]) => {
			this.registrations.set(name, {
				name,
				component,
				category: this.getComponentCategory(name),
			});
		});
	}
}
