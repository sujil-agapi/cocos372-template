import { _decorator, Component, Node, Vec3, UITransform, Label, Color, Tween, UIRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComboItem')
export class ComboItem extends Component {
    @property(Label)
    private comboTextComponent: Label = null;

    @property
    private moveUpSpeed: number = 1.0;

    @property
    private scalingFactor: number = 1.2;

    @property
    private fadeDuration: number = 1.0;

    private originalScale: Vec3;

    private isScaleAssigned : boolean;

    setComboText(comboText: string, color: Color): void {
        if (this.comboTextComponent) {
            this.comboTextComponent.string = comboText;
            this.comboTextComponent.color = color;
        }
    }

    startAnimation(): void {
        this.assignScale ();
        const targetScale = this.originalScale.multiplyScalar(this.scalingFactor);
        const startPosition = this.node.position;

        let fadeDuration = 0.5;
        let startAlpha = this.comboTextComponent.color.a;

        let elapsedTime = 0;
        const updateFunc = () => {
            if (elapsedTime < this.fadeDuration) {
                elapsedTime += 0.016; // Approximation for deltaTime
                this.node.setPosition(startPosition.add3f(0, this.moveUpSpeed * elapsedTime, 0));
                this.node.setScale(Vec3.lerp(new Vec3(), this.originalScale, targetScale, elapsedTime / this.fadeDuration));
                let alpha = Math.max(0, startAlpha * (1 - elapsedTime / fadeDuration));
                this.comboTextComponent.color = new Color(this.comboTextComponent.color.r, this.comboTextComponent.color.g, this.comboTextComponent.color.b, alpha);
            } else {
                this.node.destroy();
            }
        };

        this.schedule(updateFunc, 0.016);
    }

    private assignScale () : void  {

        if(!this.isScaleAssigned)
        {
            this.originalScale = this.node.getScale();
            this.isScaleAssigned = true;
        }
    }

    reset(): void {
        this.node.setScale(this.originalScale);
        console.error ("Add fade");
     //   this.node.getComponent(UITransform).opacity = 1;
        this.comboTextComponent.string = '';
    }
}