import { _decorator, Component, Label, Node, Vec3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ValueDisplayWidget')
export class ValueDisplayWidget extends Component {
    @property(Node)
    private countContainer: Node = null;

    @property(Label)
    private lblCount: Label = null;

    @property
    private countDuration: number = 1.0;

    @property
    private normalScale: Vec3 = new Vec3(1, 1, 1);

    @property
    private pulsatingScale: Vec3 = new Vec3(1.1, 1.1, 1);

    @property
    private pulsateDuration: number = 0.1;

    private currentValue: number = 0;

    updateValue(targetValue: number, withAnim: boolean = true): void {
        if (withAnim) {
            this.countToValue(this.currentValue, targetValue);
            this.pulsatingEffect();
        } else {
            this.lblCount.string = targetValue.toString();
            this.currentValue = targetValue;
        }
    }

    private countToValue(startValue: number, targetValue: number): void {
        let elapsedTime = 0;
        this.schedule(() => {
            if (elapsedTime < this.countDuration) {
                this.currentValue = Math.floor(
                    Vec3.lerp(new Vec3(), new Vec3(startValue, 0, 0), new Vec3(targetValue, 0, 0), elapsedTime / this.countDuration).x
                );
                this.lblCount.string = this.currentValue.toString();
                elapsedTime += 0.016; // Approximate deltaTime
            } else {
                this.unscheduleAllCallbacks(); // Stop the schedule
                this.currentValue = targetValue;
                this.lblCount.string = this.currentValue.toString();
            }
        }, 0.016);
    }

    private pulsatingEffect(): void {
        tween(this.countContainer)
            .to(this.pulsateDuration, { scale: this.pulsatingScale })
            .to(this.pulsateDuration, { scale: this.normalScale })
            .start();
    }
}