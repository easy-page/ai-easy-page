import { RouterNames, IdKeyEnum } from './constant';

export type ToPageHandler<T> = (params: T, target?: '_self' | '_blank') => void;

// 问号参数
export const appendParamsToUrl = (url: string, params: Record<string, any>) => {
	const searchParams = new URLSearchParams();
	Object.keys(params).forEach((e) => {
		if (!searchParams.get(e)) {
			searchParams.append(e, params[e]);
		} else {
			searchParams.set(e, params[e]);
		}
	});
	const newUrl = `${url}?${searchParams.toString()}`;
	return newUrl;
};

// export function addParamsToRoute(
// 	route: string,
// 	record: Record<string, any>
// ): string {
// 	// 如果记录为空，则直接返回路由字符串
// 	if (!record || Object.keys(record).length === 0) {
// 		return route;
// 	}

// 	// 构建查询参数字符串
// 	const queryParams = Object.entries(record)
// 		.map(
// 			([key, value]) =>
// 				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
// 		)
// 		.join('&');

// 	// 拼接查询参数到路由字符串末尾
// 	return route + (queryParams ? `?${queryParams}` : '');
// }

export const getIdRoute = (
	routeName: RouterNames,
	config: Partial<Record<IdKeyEnum, any>>
) => {
	let temp: string = routeName;
	Object.keys(config).forEach((e) => {
		temp = temp.replace(`:${e}`, `${config[e as IdKeyEnum]}`);
	});
	return temp;
};

// 无参数用这个，有参数类似于 toChat 定义
export const toCommonPage = (routeName: RouterNames) => {
	window.open(appendParamsToUrl(routeName, {}), '_blank');
};
