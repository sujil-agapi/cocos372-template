import { _decorator, Button, Label, Node, ProgressBar } from "cc"; // Adjust the import path
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";
import { IGameplayManager } from "../../../gameplay/core/IGameplayManager";
import { GameplayManager } from "../../../gameplay/core/GameplayManager";
import { StateMachine } from "../../../../core/utils/StateMachine";

const { ccclass, property } = _decorator;

enum MachineState {
  SomeState1 = 1,
  SomeState2 = 3,
  Size = 5
}

@ccclass("GameplayScreen")
export class GameplayScreen extends BaseScreen {

  @property(Button)
  private gameSuccessBtn : Button;

  @property(Button)
  private gameFailBtn : Button;

  private gameplayManager: IGameplayManager = null;


  private stateMachine : StateMachine;
   
  protected onLoad(): void {
    this.runStateMachine();
  }

  protected update(dt: number): void {
      this.stateMachine?.update(dt);
  }

  protected onShow(): void {
    this.gameplayManager =
      InterfaceManager.Instance.getInterface(GameplayManager);

      if (this.gameSuccessBtn) {
        this.gameSuccessBtn.node.on(
          Button.EventType.CLICK,
          this.setGameStatusAsSuccess,
          this
        );
      }

      if (this.gameFailBtn) {
        this.gameFailBtn.node.on(
          Button.EventType.CLICK,
          this.setGameStatusAsFail,
          this
        );
      }
  }

  protected onHide(): void {
    if (this.gameSuccessBtn) {
      this.gameSuccessBtn.node.off(
        Button.EventType.CLICK,
        this.setGameStatusAsSuccess,
        this
      );
    }

    if (this.gameFailBtn) {
      this.gameFailBtn.node.off(
        Button.EventType.CLICK,
        this.setGameStatusAsFail,
        this
      );
    }
  }

  private setGameStatusAsSuccess () : void {
    this.gameplayManager.setGameStatus(true);
  }
  private setGameStatusAsFail () : void {
    this.gameplayManager.setGameStatus(false);
  }

  private runStateMachine () : void {

    this.stateMachine = new StateMachine (MachineState.Size);
    this.stateMachine.registerState(MachineState.SomeState1, this.OnSomeStateEnter.bind(this), this.OnSomeStateUpdate.bind(this), this.OnSomeStateExit.bind(this));
    this.stateMachine.setState(MachineState.SomeState1);
  }

  private OnSomeStateEnter () : void {

    console.log ("OnSomeStateEnter");
  }
  private OnSomeStateUpdate () : void {
    console.log ("OnSomeStateUpdate");
  }

  private OnSomeStateExit () : void {
    console.log ("OnSomeStateExit");
  }
}
