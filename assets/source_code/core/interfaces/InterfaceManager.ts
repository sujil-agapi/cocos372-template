import { _decorator, Component, Node } from 'cc';
import { IBase } from './IBase';
const { ccclass, property } = _decorator;

@ccclass('InterfaceManager')
export class InterfaceManager {
    private static _instance: InterfaceManager;
    private _interfaceDictionary: Map<string, IBase>;

    private constructor() {
        this._interfaceDictionary = new Map<string, IBase>();
    }

    public static get Instance(): InterfaceManager {
        if (!this._instance) {
            this._instance = new InterfaceManager();
        }
        return this._instance;
    }

    public registerInterface<T extends IBase>(interfaceInstance: T): void {
        const typeName = interfaceInstance.constructor.name;
        if (!this._interfaceDictionary.has(typeName)) {
            this._interfaceDictionary.set(typeName, interfaceInstance);
        } else {
            console.log(`Interface of type ${typeName} is already registered.`);
        }
    }

    public getInterface<T extends IBase>(classType: { new(): T } | { getInstance(): T }): T {
        const typeName = (classType as any).name; // Using 'as any' to bypass TypeScript's type checking
        const interfaceInstance = this._interfaceDictionary.get(typeName);
    
        if (interfaceInstance) {
            return interfaceInstance as T;
        }
        throw new Error(`Interface of type ${typeName} is not registered.`);
    }    
}

