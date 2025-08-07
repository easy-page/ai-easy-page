import { ApiProvider } from '@/providers/common';
import { Framework } from './ioc';
import { ApiProviderMapKey } from '@/providers/interface';

export type InitIocOptions = {
	// providers: Partial<Record<ApiProviderMapKey, ApiProvider>>;
	// defaultProvider: ApiProviderMapKey;
	// 初始化服务
	initServices?: (framework: Framework) => void;
};

export const initIoc = (options: InitIocOptions) => {
	const { initServices } = options;
	const framework = new Framework();
	console.log('initServices', initServices);
	initServices?.(framework);

	return framework.provider();
};
