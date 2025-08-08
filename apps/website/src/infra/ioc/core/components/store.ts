import { Component } from './component';

/** 存储：和后端交互的层级 */
export class Store extends Component {
    readonly __isStore = true;
    readonly __injectable = true;
}
