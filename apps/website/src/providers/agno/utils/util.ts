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
			'/zspt-agent-api/v1/zspt/xf/common/uploadFile',
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
