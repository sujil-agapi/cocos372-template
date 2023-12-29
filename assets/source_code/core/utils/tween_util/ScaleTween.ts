import { _decorator, Component, Tween, Node, Vec3, tween } from 'cc';
import { EasingType, EasingTypeOptions, getEasingFunction } from './EasingType';

const { ccclass, property } = _decorator;

@ccclass('ScaleTween')
export class ScaleTween extends Component {
    @property({
        type: EasingTypeOptions,
        tooltip: "The easing function type for the animation.",
    })
    public easingType: EasingType = EasingType.Linear;

    @property
    public startScaleValue: Vec3 = new Vec3(1,1,1) // Changed to number for simplicity

    @property
    public endScaleValue: Vec3 = new Vec3(1.1,1.1,1.1); // Changed to number for simplicity

    @property
    public duration: number = 1;

    @property
    public loop: boolean = false;

    @property
    public delay: number = 0.1;

    @property
    public playOnStart: boolean = true;

    private currentTween: Tween<Node> | null = null;

    protected start(): void {
        if (this.playOnStart) this.play();
    }

    play(callback?: Function): void {
        let easingFunction = getEasingFunction(this.easingType);
        let scaleSequence = tween(this.node).sequence(
            tween().to(1, { scale: this.startScaleValue }, { easing: easingFunction }),
            tween().to(1, { scale: this.endScaleValue }, { easing: easingFunction })
        );
    
        if (this.loop) {
            this.currentTween = new Tween<Node>(this.node)
                .then(scaleSequence)
                .repeatForever();
        } else {
            // Execute the sequence once and then call the callback
            this.currentTween = new Tween<Node>(this.node)
                .then(scaleSequence)
                .call(() => {
                    if (callback && typeof callback === "function") {
                        callback();
                    }
                });
        }
    
        // Start the tween
        this.currentTween.start();
    }
    

    stop(): void {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
}
