import { Component } from './component';

/** 服务 */
export class Service extends Component {
    readonly __isService = true;
    readonly __injectable = true;
}
