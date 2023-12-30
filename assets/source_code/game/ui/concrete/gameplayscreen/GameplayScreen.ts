import { _decorator, Button, Label, Node, ProgressBar } from "cc"; // Adjust the import path
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";
import { IGameplayManager } from "../../../gameplay/core/IGameplayManager";
import { GameplayManager } from "../../../gameplay/core/GameplayManager";

const { ccclass, property } = _decorator;

@ccclass("GameplayScreen")
export class GameplayScreen extends BaseScreen {

  @property(Button)
  private gameSuccessBtn : Button;

  @property(Button)
  private gameFailBtn : Button;

  private gameplayManager: IGameplayManager = null;

  protected onLoad(): void {}

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
}
