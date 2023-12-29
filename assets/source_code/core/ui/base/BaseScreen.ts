import {_decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass("BaseScreen")
export class BaseScreen extends Component {

    public activate(...args: any[]): void {
        this.node.active = true;
        this.onShow();
    }
    protected onShow(): void {
    }

    public deactivate(): void {
        this.node.active = false;
        this.onHide();
    }

    protected onHide(): void {
    }
}