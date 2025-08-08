import { Component } from './component';

/** 全局状态 */
export class Entity<Props = {}> extends Component<Props> {
    readonly __isEntity = true;
}
