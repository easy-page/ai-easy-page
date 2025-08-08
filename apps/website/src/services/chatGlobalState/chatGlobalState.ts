import { Memento, createIdentifier, wrapMemento } from '@/infra';
import { GlobalState } from './globalState';

export interface ChatGlobalState extends Memento {}
export const ChatGlobalState =
	createIdentifier<ChatGlobalState>('ChatGlobalState');

// 用于持久化存储时，需要这个！！！！
export class ChatGlobalStateImpl implements ChatGlobalState {
	wrapped: Memento;
	constructor(globalState: GlobalState) {
		this.wrapped = wrapMemento(globalState, `chat-global-state:`);
	}

	keys(): string[] {
		return this.wrapped.keys();
	}

	get<T>(key: string): T | undefined {
		return this.wrapped.get<T>(key);
	}

	watch<T>(key: string) {
		return this.wrapped.watch<T>(key);
	}

	set<T>(key: string, value: T): void {
		return this.wrapped.set<T>(key, value);
	}

	del(key: string): void {
		return this.wrapped.del(key);
	}

	clear(): void {
		return this.wrapped.clear();
	}
}
