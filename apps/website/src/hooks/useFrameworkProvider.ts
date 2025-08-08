import { FrameworkProvider } from '@/infra';
import { ApiProvider } from '../providers/common';
import { configureChatGlobalStateModule } from '../services/chatGlobalState';
import { GlobalState } from '../services/chatGlobalState/globalState';
import { CommonDbService } from '../services/db/BaseDbService';
import { GlobalFileNames } from '../services/db/constant';
import { IndexedDBService } from '../services/db/IndexDbService';
import { LocalStorageGlobalState } from '../services/storage';
import { useState, useEffect } from 'react';
import { initIoc } from '@/infra/initIoc';

export const useFrameworkProvider = (provider: ApiProvider) => {
	const [frameworkProvider, setFrameworkProvider] =
		useState<FrameworkProvider | null>(null);

	useEffect(() => {
		const frameworkProvider = initIoc({
			initServices(framework) {
				framework.impl(GlobalState, LocalStorageGlobalState);
				framework.impl(CommonDbService, () => {
					return new IndexedDBService({
						dbName: 'ai-agent',
						version: 1,
						objectStoreNames: [GlobalFileNames.UserHabit],
						config: {
							maxRecords: 100,
							deleteCount: 60,
						},
					});
				});
				configureChatGlobalStateModule(framework, {
					provider: provider,
				});
			},
		});
		setFrameworkProvider(frameworkProvider);
	}, []);
	return frameworkProvider;
};
