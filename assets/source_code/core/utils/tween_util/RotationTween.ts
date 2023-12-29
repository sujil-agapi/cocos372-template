// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

// const {ccclass, property} = cc._decorator;

// @ccclass
// export default class RotationTween extends cc.Component {
//     @property({
//         type: EasingTypeOptions,
//         tooltip: "The easing function type for the animation.",
//       })
//       public easingType: EasingType = EasingType.Linear;
    
//       @property(Number)
//       public startAngle: number = 0; // Starting rotation angle in degrees
    
//       @property(Number)
//       public endAngle: number = 360; // Ending rotation angle in degrees
    
//       @property
//       public duration: number = 1;
    
//       @property
//       public loop: boolean = false;
    
//       @property
//       public delay: number = 0.1;
    
//       @property
//       public playOnStart: boolean = true;
    
//       private currentTween: cc.Tween | null = null;
    
//       protected start(): void {
//         if (this.playOnStart) this.play();
//       }
    
//       play(callback?: Function): void {
//         let easingFunction = getEasingFunction(this.easingType);
//         this.node.angle = this.startAngle; // Set the initial rotation angle
//         this.currentTween = cc
//             .tween(this.node)
//             .delay(this.delay)
//             .to(this.duration, { angle: this.endAngle }, { easing: easingFunction })
//             .call(() => {
//                 if (!this.loop) {
//                     if (callback && typeof callback === "function") {
//                         callback();
//                     }
//                 } else {
//                     cc.tween(this.node)
//                         .to(this.duration, { angle: this.startAngle }, { easing: easingFunction })
//                         .call(() => {
//                             this.play(callback);
//                         })
//                         .start();
//                 }
//             });
    
//         this.currentTween.start();
//       }
    
//       stop(): void {
//         if (this.currentTween) {
//           this.currentTween.stop();
//           this.currentTween = null;
//         }
//       }
// }
