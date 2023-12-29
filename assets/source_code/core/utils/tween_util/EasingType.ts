
import { Enum } from "cc";

export enum EasingType {
  Linear = 0,
  SineIn = 1,
  SineOut = 2,
  SineInOut = 3,
  QuadIn = 4,
  QuadOut = 5,
  QuadInOut = 6,
  CubicIn = 7,
  CubicOut = 8,
  CubicInOut = 9,
  QuartIn = 10,
  QuartOut = 11,
  QuartInOut = 12,
  QuintIn = 13,
  QuintOut = 14,
  QuintInOut = 15,
  ExpoIn = 16,
  ExpoOut = 17,
  ExpoInOut = 18,
  CircIn = 19,
  CircOut = 20,
  CircInOut = 21,
  ElasticIn = 22,
  ElasticOut = 23,
  ElasticInOut = 24,
  BackIn = 25,
  BackOut = 26,
  BackInOut = 27,
  BounceIn = 28,
  BounceOut = 29,
  BounceInOut = 30,
}
export const EasingTypeOptions = Enum(EasingType);

export function getEasingFunction( easingType: EasingType): any {
    switch (easingType) {
      case 1:
        return "sineIn";
      case 2:
        return "sineOut";
      case 3:
        return "sineInOut";
      case 4:
        return "quadIn";
      case 5:
        return "quadOut";
      case 6:
        return "quadInOut";
      case 7:
        return "cubicIn";
      case 8:
        return "cubicOut";
      case 9:
        return "cubicInOut";
      case 10:
        return "quartIn";
      case 11:
        return "quartOut";
      case 12:
        return "quartInOut";
      case 13:
        return "quintIn";
      case 14:
        return "quintOut";
      case 15:
        return "quintInOut";
      case 16:
        return "expoIn";
      case 17:
        return "expoOut";
      case 18:
        return "expoInOut";
      case 19:
        return "circIn";
      case 20:
        return "circOut";
      case 21:
        return "circInOut";
      case 22:
        return "elasticIn";
      case 23:
        return "elasticOut";
      case 24:
        return "elasticInOut";
      case 25:
        return "backIn";
      case 26:
        return "backOut";
      case 27:
        return "backInOut";
      case 28:
        return "bounceIn";
      case 29:
        return "bounceOut";
      case 30:
        return "bounceInOut";
      default:
        return "linear";
    }
  }
