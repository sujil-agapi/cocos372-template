import { _decorator, Component, Tween, Node, Vec3, tween } from "cc";
import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

const { ccclass, property } = _decorator;

//TODO this is not working as expected

@ccclass("RotationTween")
export class RotationTween extends Component {
  @property({
    type: EasingTypeOptions,
    tooltip: "The easing function type for the animation.",
  })
  public easingType: EasingType = EasingType.Linear;

  @property
  public startRotationValue: Vec3 = new Vec3(0, 0, 0);

  @property
  public endRotationValue: Vec3 = new Vec3(90, 90, 90);

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
    let rotationSequence = tween(this.node).sequence(
      tween().to(
        this.duration,
        { eulerAngles: this.startRotationValue },
        { easing: easingFunction }
      ),
      tween().to(
        this.duration,
        { eulerAngles: this.endRotationValue },
        { easing: easingFunction }
      ),
      tween().to(
        this.duration,
        { eulerAngles: this.startRotationValue },
        { easing: easingFunction }
      )
    );

    if (this.loop) {
      this.currentTween = new Tween<Node>(this.node)
        .then(rotationSequence)
        .repeatForever();
    } else {
      this.currentTween = new Tween<Node>(this.node)
        .then(rotationSequence)
        .call(() => {
          if (callback && typeof callback === "function") {
            callback();
          }
        });
    }

    this.currentTween.start();
  }

  stop(): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }
  }
}
