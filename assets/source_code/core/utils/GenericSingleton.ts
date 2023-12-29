import { _decorator, Component, DebugMode, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GenericSingleton')
export abstract class GenericSingleton<T extends Component> extends Component {

    private static instances: Map<string, Component> = new Map();

    public static Instance<T extends Component>(this: new () => T): T {
        let className = this.name;
        if (!GenericSingleton.instances.has(className)) {
            let newNode = new Node(className);
            let newComponent = newNode.addComponent(this);
            GenericSingleton.instances.set(className, newComponent);
        }

        return GenericSingleton.instances.get(className) as T;
    }

    public static IsExist<T extends Component>(this: new () => T): boolean {
        return GenericSingleton.instances.has(this.name);
    }

    protected onLoad(): void {
        let className = (this.constructor as typeof Component).name;

        if (GenericSingleton.instances.has(className) && GenericSingleton.instances.get(className) !== this) {
            this.node.destroy();
            return;
        }

        GenericSingleton.instances.set(className, this);
    }
}