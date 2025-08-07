import { getEnv } from '../../../common/utils/env';

export type UploadFileResult = {
	fileUrl: string;
};

// 先富上传文件
export const uploadMbdFile = async (options: {
	mimeType: string;
	displayName: string;
	file: File;
}) => {
	const { mimeType, displayName, file: oriFile } = options;
	console.log('uploadFile', mimeType, displayName);

	const form = new FormData();

	form.append('file', oriFile);
	// form.append('scene', UploadSceneEnum.RuleDesc as any);

	try {
		const response = await fetch(
			'/zspt-agent-api/v1zspt/xf/common/uploadFile',
			{
				method: 'POST',
				body: form,
				// headers: { 'Content-Type': 'multipart/form-data' },
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = (await response.json())?.data;

		return {
			fileUrl: data?.url,
		} as UploadFileResult;
	} catch (error) {
		console.error('上传文件时出错:', error);
		throw error;
	}
};

/** 下方是为了兼容，临时抄一下 */

export const prepareCanApplyData = (data: any[]) => {
	let baseUrl = 'https://marketingop.waimai.test.sankuai.com';

	switch (getEnv()) {
		case 'test':
			baseUrl = 'https://marketingop.waimai.test.sankuai.com';
			break;
		case 'st':
			baseUrl = 'https://marketingop.waimai.st.sankuai.com';
			break;
		case 'prod':
			baseUrl = 'https://marketingop.waimai.meituan.com';
			break;
	}
	return (data || []).map((e: any) => {
		return {
			id: (e.poiIds || []).join('_'),
			poi_ids: e.poiIds || [],
			acts: (e.actList || []).map((x: any) => ({
				act_id: x.activityId,
				act_name: x.activityName,
				subsidy: x.poiSubsidy,
				act_link: `${baseUrl}/integrate/bd/InviteBrandList?inviteId=${x.activityId}&poiPolicyType=93&brandType=srvBrand`,
			})),
		};
	});
};
