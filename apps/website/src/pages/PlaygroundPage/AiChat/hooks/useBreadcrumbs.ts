import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from './useObservable';
import { useService } from '@/infra';
import {
	Breadcrumb,
	ModuleType,
} from '@/services/chatGlobalState/chatGlobalStateEntity';

export const useBreadcrumbs = () => {
	const chatService = useService(ChatService);
	const curModule = useObservable(
		chatService.globalState.activeModule$,
		ModuleType.Venue
	);
	const breadcrumbsMap = useObservable(
		chatService.globalState.breadcrumbsMap$,
		{
			[ModuleType.Venue]: [],
			[ModuleType.Team]: [],
			[ModuleType.Material]: [],
			[ModuleType.Activity]: [],
			[ModuleType.Setting]: [],
		} as Record<ModuleType, Breadcrumb[]>
	);

	return {
		breadcrumbs: breadcrumbsMap[curModule] || [],
		curModule,
		chatService,
		setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
			chatService.globalState.setModuleBreadcrumbs(curModule, breadcrumbs);
		},
	};
};
