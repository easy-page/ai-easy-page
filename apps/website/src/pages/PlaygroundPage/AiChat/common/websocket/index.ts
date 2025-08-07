import { WsClientMsg, WsServerMsg } from '../interfaces/messages';
import { WsClientMsgType, WsServerMsgType } from '../constants/wsMessages';

function parseMultipleJSONs(jsonStr: string): any[] {
	const result: any[] = [];
	let startIndex = 0;
	let openBraceCount = 0;
	let inString = false;

	for (let i = 0; i < jsonStr.length; i++) {
		const char = jsonStr[i];

		if (char === '"' && jsonStr[i - 1] !== '\\') {
			inString = !inString;
		}

		if (!inString) {
			if (char === '{') {
				if (openBraceCount === 0) {
					startIndex = i;
				}
				openBraceCount++;
			} else if (char === '}') {
				openBraceCount--;
				if (openBraceCount === 0) {
					const jsonSubStr = jsonStr.slice(startIndex, i + 1);
					try {
						const parsed = JSON.parse(jsonSubStr);
						result.push(parsed);
					} catch (error) {
						console.error(`【ws】解析 JSON 片段时出错: ${jsonSubStr}`, error);
					}
				}
			}
		}
	}

	return result;
}

function toJson(str: string, defaultValue: any = {}) {
	try {
		return JSON.parse(str);
	} catch (error) {
		console.error('JSON 解析出错:', error, str);
		return defaultValue;
	}
}

// toJson()

// 定义 WSOptions 类型
export interface WSOptions {
	url: string;
	heartTime?: number;
	heartMsg?: string;
	isReconnect?: boolean;
	isRestory?: boolean;
	taskId: number;
	reconnectTime?: number;
	reconnectCount?: number;
	connected?: () => void;
	openCb?: (event: Event) => void;
	closeCb?: (event: CloseEvent) => void;
	messageCb?: (event: MessageEvent, message: WsServerMsg) => void;
	errorCb?: (event: Event) => void;
	csrfToken?: string;
}

// 定义 OpenCallback 类型
export type OpenCallback = (event: Event) => void;

// 定义 CloseCallback 类型
export type CloseCallback = (event: CloseEvent) => void;

// 定义 ErrorCallback 类型
export type ErrorCallback = (event: Event) => void;

// 定义 MessageCallback 类型
export type MessageCallback = (event: MessageEvent) => void;

// 定义 Message 类型
interface Message {
	MsgId: string;
}

/**
 * 心跳基类
 */
export class Heart {
	heartTimeOut: ReturnType<typeof setTimeout> | undefined; // 心跳计时器
	timeout = 30000;

	pongTime: number = new Date().getTime();

	pong() {
		this.pongTime = new Date().getTime();
	}

	// 重置
	reset(): void {
		if (this.heartTimeOut) {
			clearTimeout(this.heartTimeOut);
		}
	}

	/**
	 * 启动心跳
	 * @param {OpenCallback} cb 回调函数
	 */
	start(cb: OpenCallback): void {
		this.heartTimeOut = setTimeout(() => {
			// this.timeout 是毫秒，要做一个转换
			if (new Date().getTime() - this.pongTime > this.timeout * 1.5) {
				// 超过 timeout 时间没有响应 pong 消息，连接已断开。
				console.warn('连接已经断开');
				// Toast.warning({
				//     content: '连接已断开',
				// });
			}
			cb(new Event('heartbeat'));
			// 重新开始检测
			this.reset();
			this.start(cb);
		}, this.timeout);
	}
}

export default class Socket extends Heart {
	ws: WebSocket = null as unknown as WebSocket;

	reconnectTimer: ReturnType<typeof setTimeout> | 0 = 0; // 重连计时器
	reconnectCount = 5; // 重连次数

	options: Required<WSOptions> = {
		url: '', // 链接的通道的地址
		heartTime: 5000, // 心跳时间间隔
		heartMsg: 'ping', // 心跳信息,默认为'ping'
		isReconnect: true, // 是否自动重连
		isRestory: false, // 是否销毁
		reconnectTime: 5000, // 重连时间间隔
		reconnectCount: 5, // 重连次数 -1 则不限制
		taskId: -1,
		csrfToken: '',
		connected: () => {},
		// 连接成功的回调
		openCb: (e) => {},
		// 关闭的回调
		closeCb: (e) => {},
		// 收到消息的回调
		messageCb: (e) => {},
		// 错误的回调
		errorCb: (e) => {},
	};

	constructor(ops: WSOptions) {
		super();
		Object.keys(ops).forEach((key: string) => {
			const opsKey = key as keyof WSOptions;
			if (ops[opsKey] !== undefined) {
				(this.options as any)[opsKey] = ops[opsKey];
			}
		});
		this.reconnectCount = this.options.reconnectCount;
		this.init();
	}

	handleEachMessage(event: MessageEvent<any>, message: WsServerMsg) {
		if (!message) {
			// TODO 需要埋点
			console.error('message is null');
			return;
		}
		if (message.type === WsServerMsgType.PONG) {
			console.log('ws pong');
			return;
		}
		if (message.type === WsServerMsgType.CONNECTION) {
			this.options.connected();
			return;
		}
		this.options.messageCb(event, message);
	}

	/**
	 * 建立连接
	 */
	init(): void {
		if (!('WebSocket' in window)) {
			throw new Error('the browser does not support');
		}
		if (!this.options.url) {
			throw new Error('url is empty');
		}

		this.ws = new WebSocket(
			`${this.options.url}?csrf_token=${this.options.csrfToken}`
		);
		this.onopen(this.options.openCb);
		this.onclose(this.options.closeCb);
		this.ws.onmessage = (event) => {
			try {
				const msgStr = event.data;
				const message: WsServerMsg = toJson(msgStr, null);
				console.log('msgStr msgStr:', typeof message, message);

				if (!message) {
					// TODO 需要埋点
					console.error('msgStr msgStr message is null:', msgStr);
					const msgs = parseMultipleJSONs(msgStr);
					msgs.forEach((message) => {
						this.handleEachMessage(event, message);
					});
					return;
				}
				this.handleEachMessage(event, message);
			} catch (error) {
				console.error(error);
			}
		};
		this.onerror(this.options.errorCb);
	}

	/**
	 * 连接成功事件
	 * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
	 */
	onopen(callback: OpenCallback): void {
		this.ws.onopen = (event) => {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer); // 清除重连定时器
			}
			this.options.reconnectCount = this.reconnectCount; // 计数器重置

			// 建立心跳机制
			super.reset();
			super.start(() => {
				this.sendPing();
			});
			if (typeof callback === 'function') {
				callback(event);
			} else {
				typeof this.options.openCb === 'function' && this.options.openCb(event);
			}
		};
	}

	private sendPing() {
		this.send({
			type: WsClientMsgType.PING,
			content: '',
		});
	}

	/**
	 * 自定义关闭事件
	 * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
	 * @param {CloseCallback} callback 回调函数
	 */
	onclose(callback: CloseCallback): void {
		this.ws.onclose = (event) => {
			super.reset();
			if (!this.options.isRestory) {
				this.onreconnect();
			}
			if (typeof callback === 'function') {
				callback(event);
			} else {
				typeof this.options.closeCb === 'function' &&
					this.options.closeCb(event);
			}
		};
	}

	/**
	 * 自定义错误事件
	 * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
	 * @param {ErrorCallback} callback 回调函数
	 */
	onerror(callback: ErrorCallback): void {
		this.ws.onerror = (event) => {
			if (typeof callback === 'function') {
				callback(event);
			} else {
				typeof this.options.errorCb === 'function' &&
					this.options.errorCb(event);
			}
		};
	}

	/**
	 * 自定义发送消息事件
	 * @param {string} data 发送的文本
	 */
	send(data: Omit<WsClientMsg, 'task_id' | 'timestamp' | 'source'>): void {
		if (this.ws.readyState !== this.ws.OPEN) {
			throw new Error('websocket is not connect');
		}
		this.ws.send(
			JSON.stringify({
				...data,
				source: 'client',
				task_id: this.options.taskId,
				timestamp: new Date().getTime(),
			})
		);
	}

	/**
	 * 连接事件
	 */
	onreconnect(): void {
		if (this.options.reconnectCount > 0 || this.options.reconnectCount === -1) {
			this.reconnectTimer = window.setTimeout(() => {
				this.init();
				if (this.options.reconnectCount !== -1) this.options.reconnectCount--;
			}, this.options.reconnectTime) as any;
		} else {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
			}
			this.options.reconnectCount = this.reconnectCount;
		}
	}

	/**
	 * 销毁
	 */
	destroy(): void {
		super.reset();
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer); // 清除重连定时器
		}
		this.options.isRestory = true;
		this.ws.close();
	}
}
