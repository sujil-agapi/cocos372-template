import { _decorator, Component, Node, Vec3, instantiate, Prefab, math, UITransform, Color } from 'cc';
import { ComboItem } from './ComboItem'; // Adjust the import path
const { ccclass, property } = _decorator;

@ccclass('ComboWidget')
export class ComboWidget extends Component {
    @property(Prefab)
    private comboPrefab: Prefab = null;

    @property(Node)
    private comboContainer: Node = null;

    @property
    private proximityToCenter: number = 0.2;

    @property([Color])
    private color: Color[] = [];

    start(): void {
        // Initialization logic if needed
    }

    terminate(): void {
        this.comboContainer.removeAllChildren();
    }

    triggerCombo(comboText: string): void {
        const randomPosition = this.getRandomPositionInsideWidget();
        const comboInstance = instantiate(this.comboPrefab);
        comboInstance.setPosition(randomPosition);
        comboInstance.setParent(this.comboContainer);

        const comboItem = comboInstance.getComponent(ComboItem);
        if (comboItem) {
            const randomIndex = math.randomRangeInt(0, this.color.length);
            comboItem.setComboText(comboText, this.color[randomIndex]);
            comboItem.startAnimation();
        }
    }

    private getRandomPositionInsideWidget(): Vec3 {
        const randomXOffset = math.randomRange(-this.proximityToCenter, this.proximityToCenter);
        const randomYOffset = math.randomRange(-this.proximityToCenter, this.proximityToCenter);
        return new Vec3(randomXOffset, randomYOffset, 0);
    }
}