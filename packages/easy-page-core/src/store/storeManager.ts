import { FormStoreImpl } from './store';
import { FieldValue, FormMode } from '../types';

/**
 * Store 管理器，支持多个独立的 store 实例
 */
export class StoreManager {
	private static instance: StoreManager;
	private stores: Map<string, FormStoreImpl> = new Map();
	private defaultStoreId = 'default';

	private constructor() {}

	static getInstance(): StoreManager {
		if (!StoreManager.instance) {
			StoreManager.instance = new StoreManager();
		}
		return StoreManager.instance;
	}

	/**
	 * 创建或获取 store 实例
	 * @param id store 的唯一标识
	 * @param initialValues 初始值
	 * @param maxConcurrentRequests 最大并发请求数
	 * @param mode 表单模式
	 */
	createStore(
		id: string,
		initialValues: Record<string, FieldValue> = {},
		maxConcurrentRequests: number = 5,
		mode: FormMode = FormMode.CREATE
	): FormStoreImpl {
		if (this.stores.has(id)) {
			console.warn(
				`Store with id "${id}" already exists, returning existing instance`
			);
			return this.stores.get(id)!;
		}

		const store = new FormStoreImpl(initialValues, maxConcurrentRequests, mode);
		this.stores.set(id, store);
		return store;
	}

	/**
	 * 获取 store 实例
	 * @param id store 的唯一标识
	 */
	getStore(id: string): FormStoreImpl | null {
		return this.stores.get(id) || null;
	}

	/**
	 * 获取默认 store
	 */
	getDefaultStore(): FormStoreImpl | null {
		return this.getStore(this.defaultStoreId);
	}

	/**
	 * 删除 store 实例
	 * @param id store 的唯一标识
	 */
	removeStore(id: string): boolean {
		return this.stores.delete(id);
	}

	/**
	 * 清理所有 store
	 */
	clearAllStores(): void {
		this.stores.clear();
	}

	/**
	 * 获取所有 store 的 ID
	 */
	getStoreIds(): string[] {
		return Array.from(this.stores.keys());
	}

	/**
	 * 获取 store 数量
	 */
	getStoreCount(): number {
		return this.stores.size;
	}

	/**
	 * 检查 store 是否存在
	 * @param id store 的唯一标识
	 */
	hasStore(id: string): boolean {
		return this.stores.has(id);
	}
}

// 导出单例实例
export const storeManager = StoreManager.getInstance();

// 便捷函数
export const createFormStore = (
	id: string,
	initialValues: Record<string, FieldValue> = {},
	maxConcurrentRequests: number = 5,
	mode: FormMode = FormMode.CREATE
): FormStoreImpl => {
	return storeManager.createStore(
		id,
		initialValues,
		maxConcurrentRequests,
		mode
	);
};

export const getFormStore = (id: string): FormStoreImpl | null => {
	return storeManager.getStore(id);
};

export const removeFormStore = (id: string): boolean => {
	return storeManager.removeStore(id);
};
