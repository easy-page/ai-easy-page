import { createIdentifier, Service } from '../../infra';

export abstract class DBService extends Service {
	// 向指定对象存储添加数据
	abstract addData(
		objectStoreName: string,
		data: {
			queryId: string;
			data: any;
		}
	): Promise<number>;
	// 根据 ID 从指定对象存储获取数据，此 ID 是：queryId
	abstract getDataById(objectStoreName: string, queryId: string): Promise<any>;
	// 从指定对象存储获取所有数据
	abstract getAllData(objectStoreName: string): Promise<any[]>;
	// 更新指定对象存储中的数据
	abstract updateData(objectStoreName: string, data: any): Promise<void>;
	// 根据 ID 从指定对象存储删除数据
	abstract deleteDataById(
		objectStoreName: string,
		queryId: string
	): Promise<void>;
}

export const CommonDbService = createIdentifier<DBService>('DBService');
