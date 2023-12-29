import { _decorator, Button, Component, Node, sys } from "cc";
import { GameStateManager } from "../../../../core/gamestate/GameStateManager";
import { GameState } from "../../../../core/gamestate/GameStates";
import { IGameStateManager } from "../../../../core/gamestate/IGameStateManager";
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";
const { ccclass, property } = _decorator;

@ccclass("GameResetScreen")
export class GameResetScreen extends BaseScreen {
  @property(Button)
  private resetBtn: Button = null;

  private gameManager: IGameStateManager;

  protected onShow(): void {
    super.onShow();
    this.gameManager = InterfaceManager.Instance.getInterface(GameStateManager);

    this.resetBtn.node.on(Button.EventType.CLICK, this.onResetBtnClick, this);
  }
  protected onHide(): void {
    super.onHide();
    this.resetBtn.node.off(Button.EventType.CLICK, this.onResetBtnClick, this);
  }

  private onResetBtnClick(): void {
    sys.localStorage.clear();
    this.gameManager.forceChangeGameState(GameState.Home);
    console.log('cleared all the progress');
  }
}
