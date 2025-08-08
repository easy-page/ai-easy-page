import { DBService } from './BaseDbService';

interface DBServiceOptions {
	dbName: string;
	version: number;
	objectStoreNames: string[];
	config?: {
		maxRecords?: number; // 最大记录数
		deleteCount?: number; // 超出时删除的记录数
	};
}

export class IndexedDBService extends DBService {
	private db: IDBDatabase | null = null;
	private dbName: string;
	private version: number;
	private objectStoreNames: string[];
	private config: Required<NonNullable<DBServiceOptions['config']>>;

	constructor(options: DBServiceOptions) {
		super();
		this.dbName = options.dbName;
		this.version = options.version;
		this.objectStoreNames = options.objectStoreNames;
		this.config = {
			maxRecords: 100,
			deleteCount: 60,
			...options.config,
		};
	}

	// 打开数据库
	async open(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = (event.target as IDBOpenDBRequest).result;
				console.log('onupgradeneeded', this.objectStoreNames);
				this.objectStoreNames.forEach((objectStoreName) => {
					if (!db.objectStoreNames.contains(objectStoreName)) {
						const objectStore = db.createObjectStore(objectStoreName, {
							keyPath: 'id',
							autoIncrement: true,
						});
						objectStore.createIndex('queryIndex', 'queryId', { unique: false });
						objectStore.createIndex('timestampIndex', 'timestamp', {
							unique: false,
						});
					}
				});
			};

			request.onsuccess = (event) => {
				this.db = (event.target as IDBOpenDBRequest).result;
				resolve();
			};

			request.onerror = (event) => {
				reject((event.target as IDBOpenDBRequest).error);
			};
		});
	}

	// 关闭数据库
	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}

	// 添加数据到指定的对象存储
	async addData(
		objectStoreName: string,
		data: {
			queryId: string;
			data: any;
			timestamp?: number;
		}
	): Promise<number> {
		if (!this.db) {
			await this.open();
		}

		const { maxRecords = 100, deleteCount = 60 } = this.config;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([objectStoreName], 'readwrite');
			const objectStore = transaction.objectStore(objectStoreName);
			const index = objectStore.index('queryIndex');

			// 首先查找是否存在相同 queryId 的记录
			const getRequest = index.get(data.queryId);

			getRequest.onsuccess = async (event) => {
				const existingData = (event.target as IDBRequest).result;

				if (existingData) {
					// 如果存在，则更新该记录
					const updateRequest = objectStore.put({
						...existingData,
						data: data.data,
						timestamp: Date.now(),
					});

					updateRequest.onsuccess = (event) => {
						resolve((event.target as IDBRequest).result as number);
					};

					updateRequest.onerror = (event) => {
						reject((event.target as IDBRequest).error);
					};
				} else {
					// 如果不存在，检查记录数并可能清理旧记录
					const countRequest = objectStore.count();

					countRequest.onsuccess = () => {
						const totalRecords = countRequest.result;
						console.log('totalRecords', totalRecords, maxRecords);
						if (totalRecords >= maxRecords) {
							// 如果超过最大记录数，删除最早的记录
							const keyRangeRequest = objectStore
								.index('timestampIndex')
								.getAllKeys(IDBKeyRange.upperBound(Infinity), deleteCount);

							keyRangeRequest.onsuccess = () => {
								const keys = keyRangeRequest.result;
								if (keys.length > 0) {
									const deleteRequest = objectStore.delete(
										IDBKeyRange.bound(keys[0], keys[keys.length - 1])
									);

									deleteRequest.onsuccess = () => {
										// 删除完成后添加新记录
										addNewRecord();
									};

									deleteRequest.onerror = (event) => {
										reject((event.target as IDBRequest).error);
									};
								} else {
									addNewRecord();
								}
							};

							keyRangeRequest.onerror = (event) => {
								reject((event.target as IDBRequest).error);
							};
						} else {
							// 直接添加新记录
							addNewRecord();
						}
					};

					countRequest.onerror = (event) => {
						reject((event.target as IDBRequest).error);
					};
				}
			};

			getRequest.onerror = (event) => {
				reject((event.target as IDBRequest).error);
			};

			// 封装添加新记录的逻辑
			function addNewRecord() {
				const newData = {
					...data,
					timestamp: Date.now(),
				};
				const addRequest = objectStore.add(newData);

				addRequest.onsuccess = (event) => {
					resolve((event.target as IDBRequest).result as number);
				};

				addRequest.onerror = (event) => {
					reject((event.target as IDBRequest).error);
				};
			}
		});
	}

	// 根据 ID 获取指定对象存储中的数据
	async getDataById(objectStoreName: string, queryId: string): Promise<any> {
		if (!this.db) {
			await this.open();
		}
		const transaction = this.db!.transaction([objectStoreName], 'readonly');
		const objectStore = transaction.objectStore(objectStoreName);
		const index = objectStore.index('queryIndex');
		return new Promise((resolve, reject) => {
			const request = index.getAll(queryId);

			request.onsuccess = (event) => {
				resolve((event.target as IDBRequest).result?.data);
			};

			request.onerror = (event) => {
				reject((event.target as IDBRequest).error);
			};
		});
	}

	// 获取指定对象存储中的所有数据
	async getAllData(objectStoreName: string): Promise<any[]> {
		if (!this.db) {
			await this.open();
		}
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([objectStoreName], 'readonly');
			const objectStore = transaction.objectStore(objectStoreName);
			const request = objectStore.getAll();

			request.onsuccess = (event) => {
				resolve(
					((event.target as IDBRequest).result as any[]).map((e) => e?.data)
				);
			};

			request.onerror = (event) => {
				reject((event.target as IDBRequest).error);
			};
		});
	}

	// 更新指定对象存储中的数据
	async updateData(
		objectStoreName: string,
		data: {
			queryId: string;
			data: any;
		}
	): Promise<void> {
		if (!this.db) {
			await this.open();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([objectStoreName], 'readwrite');
			const objectStore = transaction.objectStore(objectStoreName);
			const index = objectStore.index('queryIndex');

			// 首先获取对应 queryId 的记录
			const getRequest = index.get(data.queryId);

			getRequest.onsuccess = (event) => {
				const existingData = (event.target as IDBRequest).result;

				if (!existingData) {
					reject(new Error(`No record found with queryId: ${data.queryId}`));
					return;
				}

				// 更新现有记录
				const updateRequest = objectStore.put({
					...existingData,
					data: data.data,
				});

				updateRequest.onsuccess = () => {
					resolve();
				};

				updateRequest.onerror = (event) => {
					reject((event.target as IDBRequest).error);
				};
			};

			getRequest.onerror = (event) => {
				reject((event.target as IDBRequest).error);
			};
		});
	}

	// 根据 ID 删除指定对象存储中的数据
	async deleteDataById(
		objectStoreName: string,
		queryId: string
	): Promise<void> {
		if (!this.db) {
			await this.open();
		}
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([objectStoreName], 'readwrite');
			const objectStore = transaction.objectStore(objectStoreName);
			const index = objectStore.index('queryIndex');

			// 只获取主键值
			const getKeyRequest = index.getKey(queryId);

			getKeyRequest.onsuccess = () => {
				const primaryKey = getKeyRequest.result;
				if (!primaryKey) {
					resolve(); // 如果没找到记录，直接返回
					return;
				}

				// 使用主键直接删除
				const deleteRequest = objectStore.delete(primaryKey);

				deleteRequest.onsuccess = () => {
					console.log('删除会话成功：', queryId);
					resolve();
				};

				deleteRequest.onerror = (event) => {
					reject((event.target as IDBRequest).error);
				};
			};

			getKeyRequest.onerror = (event) => {
				reject((event.target as IDBRequest).error);
			};
		});
	}
}

// async function main() {
//   const dbService = new IndexedDBService('myDatabase', 1, ['myObjectStore']);

//   try {
//       // 打开数据库
//       await dbService.open();

//       // 添加数据
//       const newId = await dbService.addData('myObjectStore', { name: 'John', age: 30 });
//       console.log('Added data with ID:', newId);

//       // 获取所有数据
//       const allData = await dbService.getAllData('myObjectStore');
//       console.log('All data:', allData);

//       // 根据 ID 获取数据
//       const dataById = await dbService.getDataById('myObjectStore', newId);
//       console.log('Data by ID:', dataById);

//       // 更新数据
//       dataById.age = 31;
//       await dbService.updateData('myObjectStore', dataById);
//       const updatedData = await dbService.getDataById('myObjectStore', newId);
//       console.log('Updated data:', updatedData);

//       // 删除数据
//       await dbService.deleteDataById('myObjectStore', newId);
//       const remainingData = await dbService.getAllData('myObjectStore');
//       console.log('Remaining data:', remainingData);

//       // 关闭数据库
//       dbService.close();
//   } catch (error) {
//       console.error('Error:', error);
//   }
// }
