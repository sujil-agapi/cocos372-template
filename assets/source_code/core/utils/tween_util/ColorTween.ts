import {
  _decorator,
  Component,
  Color,
  Node,
  Tween,
  tween,
  UIOpacity,
  Sprite,
  CCInteger,
  Enum,
} from "cc";
import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

const { ccclass, property } = _decorator;

enum TweenType {
  Color = 0,
  Alpha = 1,
}

@ccclass("ColorTween")
export class ColorTween extends Component {
  @property({
    type: EasingTypeOptions,
    tooltip: "The easing function type for the animation.",
  })
  public easingType: EasingType = EasingType.Linear;

  @property({
    type: Enum(TweenType),
    tooltip: "Choose between tweening color or alpha.",
  })
  public tweenType: TweenType = TweenType.Color;

  @property({
    visible() {
      return this.tweenType === TweenType.Color;
    },
  })
  public startColor: Color = new Color (0,0,0);

  @property({
    visible() {
      return this.tweenType === TweenType.Color;
    },
  })
  public endColor: Color = new Color (0,0,0);

  @property({
    type: CCInteger,
    visible() {
      return this.tweenType === TweenType.Alpha;
    },
    tooltip: "Starting alpha value.",
    slide: true,
    range: [0, 255, 1],
  })
  public startAlpha: number = 255;

  @property({
    type: CCInteger,
    visible() {
      return this.tweenType === TweenType.Alpha;
    },
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

    if (this.tweenType === TweenType.Alpha) {
      const uiOpacity = this.node.getComponent(UIOpacity);
      if (uiOpacity) {
        uiOpacity.opacity = this.startAlpha;
        this.currentTween = tween(uiOpacity)
          .delay(this.delay)
          .to(
            this.duration,
            { opacity: this.endAlpha },
            { easing: easingFunction }
          );
      } else {
        console.error("UIOpacity component not found on the node");
        return;
      }
    } else {
      // Color tween
      const sprite = this.node.getComponent(Sprite);
      if (sprite) {
        sprite.color = new Color(this.startColor);
        this.currentTween = tween(sprite)
          .delay(this.delay)
          // Using a new Color object for the end color
          .to(
            this.duration,
            { color: new Color(this.endColor) },
            { easing: easingFunction }
          );
      } else {
        console.error("Sprite component not found on the node");
        return;
      }
    }

    if (this.loop) {
      this.currentTween.repeatForever();
    } else if (callback) {
      this.currentTween.call(callback);
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
