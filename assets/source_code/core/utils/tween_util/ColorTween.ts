import { _decorator, Component, Color, Tween, tween, Sprite, Enum } from "cc";
import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

const { ccclass, property } = _decorator;

@ccclass("ColorTween")
export class ColorTween extends Component {
  @property({
    type: EasingTypeOptions,
    tooltip: "The easing function type for the animation.",
  })
  public easingType: EasingType = EasingType.Linear;

  @property
  public startColor: Color = new Color(0, 0, 0);

  @property
  public endColor: Color = new Color(0, 0, 0);

  @property
  public duration: number = 1;

  @property
  public loop: boolean = false;

  @property
  public delay: number = 0.1;

  @property
  public playOnStart: boolean = true;

  private currentTween: Tween<any> | null = null;

  protected start(): void {
    if (this.playOnStart) {
      this.play();
    }
  }

  play(callback?: Function): void {
    let easingFunction = getEasingFunction(this.easingType);
    this.currentTween?.stop();

    const sprite = this.node.getComponent(Sprite);
    if (sprite) {
      sprite.color = new Color(this.startColor);
      let colorTween = tween(sprite)
        .delay(this.delay)
        .to(
          this.duration,
          { color: new Color(this.startColor) },
          { easing: easingFunction }
        )
        .to(
          this.duration,
          { color: new Color(this.endColor) },
          { easing: easingFunction }
        );

      if (this.loop) {
        this.currentTween = new Tween<Sprite>(sprite).then(colorTween).repeatForever();
      } else if (callback) {
        this.currentTween = new Tween<Sprite>(sprite)
          .then(colorTween)
          .call(() => {
            if (callback && typeof callback === "function") {
              callback();
            }
          });
      }

      this.currentTween.start();
    } else {
      console.error("Sprite component not found on the node");
    }
  }

  stop(): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }
  }
}
