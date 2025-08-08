import { RequestResult } from '@/apis/axios';
import { SenceConfig } from '../../../common/interfaces/senceConfig';
import { EnvEnum, getEnv } from '../../../common/utils/env';
import { DefaultSenceData } from '../senceData';

export const getSenceConfig = async (
	userMis: string
): Promise<RequestResult<SenceConfig[]>> => {
	try {
		// const userMis = 'xuexinghuan';
		// 从 S3 获取配置
		const response = await fetch(
			`https://s3plus.meituan.net/zspt-fe/kabd/kabd_two_white_scene_list_2.json?t=${Date.now()}`,
			{
				cache: 'no-store', // 或 'no-store' 完全禁用缓存
			}
		);
		const res = await response.json();

		const isTest = getEnv() === EnvEnum.Test;

		console.log('resresresxxx:', res);

		// 如果没有配置或没有白名单，返回默认数据
		if (!res?.whiteList || isTest) {
			return {
				success: true,
				data: DefaultSenceData,
			};
		}

		const { whiteList, sences } = res;

		// 如果在白名单中，返回默认数据
		if (whiteList.includes(userMis)) {
			console.log('resresresxxx 12121212');

			return {
				success: true,
				data: DefaultSenceData,
			};
		}

		// 不在白名单中，过滤掉 sences 中的数据
		const filteredData = DefaultSenceData.filter((item) =>
			sences.includes(item.id)
		);

		return {
			success: true,
			data: filteredData,
		};
	} catch (error) {
		console.error('获取场景配置失败:', error);
		// 发生错误时返回默认数据
		return {
			success: true,
			data: DefaultSenceData,
		};
	}
};
