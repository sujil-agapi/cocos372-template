import { _decorator, Component, Tween, tween, UIOpacity, CCInteger, Enum } from "cc";
import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

const { ccclass, property } = _decorator;

@ccclass("AlphaTween")
export class AlphaTween extends Component {
  @property({
    type: EasingTypeOptions,
    tooltip: "The easing function type for the animation.",
  })
  public easingType: EasingType = EasingType.Linear;

  @property({
    type: CCInteger,
    tooltip: "Starting alpha value.",
    slide: true,
    range: [0, 255, 1],
  })
  public startAlpha: number = 255;

  @property({
    type: CCInteger,
    tooltip: "Ending alpha value.",
    slide: true,
    range: [0, 255, 1],
  })
  public endAlpha: number = 255;

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

    const uiOpacity = this.node.getComponent(UIOpacity);
    if (uiOpacity) {
      uiOpacity.opacity = this.startAlpha;
      let opacityTween = tween(uiOpacity)
        .delay(this.delay)
        .to(this.duration, { opacity: this.startAlpha }, { easing: easingFunction })
        .to(this.duration, { opacity: this.endAlpha }, { easing: easingFunction });

      if (this.loop) {
        this.currentTween = new Tween<any>(uiOpacity).then(opacityTween).repeatForever();
      } else if (callback) {
        this.currentTween = new Tween<any>(uiOpacity)
          .then(opacityTween)
          .call(() => {
            if (callback && typeof callback === "function") {
              callback();
            }
          });
      }

      this.currentTween.start();
    } else {
      console.error("UIOpacity component not found on the node");
    }
  }

  stop(): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }
  }
}
