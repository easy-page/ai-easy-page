import { ApiProvider } from './common';

export declare interface ApiProviderMap {
	agno: ApiProvider;
	adk: ApiProvider;
}

export type ApiProviderMapKey = keyof ApiProviderMap;
