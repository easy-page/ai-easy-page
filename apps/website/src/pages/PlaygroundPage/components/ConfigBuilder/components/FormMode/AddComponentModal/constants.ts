// Tab 相关常量
export const TAB_KEYS = {
	CATEGORIES: 'categories',
	SEARCH: 'search',
	FAVORITES: 'favorites',
	RECENT: 'recent',
} as const;

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

// localStorage 相关常量
export const STORAGE_KEYS = {
	COMPONENT_FAVORITES: 'component-favorites',
	COMPONENT_RECENT: 'component-recent',
} as const;

// 默认值常量
export const DEFAULTS = {
	MAX_RECENT_COMPONENTS: 10,
	DEFAULT_IS_FORM_COMPONENT: true,
} as const;
