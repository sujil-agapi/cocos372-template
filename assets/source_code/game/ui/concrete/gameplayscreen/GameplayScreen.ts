import { _decorator, Label, Node, ProgressBar } from "cc"; // Adjust the import path
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";
import { IGameplayManager } from "../../../gameplay/core/IGameplayManager";
import { GameplayManager } from "../../../gameplay/core/GameplayManager";

const { ccclass, property } = _decorator;

@ccclass("GameplayScreen")
export class GameplayScreen extends BaseScreen {
  private gameplayManager: IGameplayManager = null;

  protected onLoad(): void {}

  protected onShow(): void {
    this.gameplayManager =
      InterfaceManager.Instance.getInterface(GameplayManager);
  }

  protected onHide(): void {}
}
