import { _decorator, Component, Node } from 'cc';
import { IBase } from '../core/interfaces/IBase';
import { BaseScreen } from './base/BaseScreen';
const { ccclass, property } = _decorator;
export interface IUiManager extends IBase {
    activate<T extends BaseScreen>(...args: any[]): void;

    deactivate<T extends BaseScreen>(type: new (...args: any[]) => T): void;
    getScreen<T extends BaseScreen>(type: new (...args: any[]) => T): T | null;
}

