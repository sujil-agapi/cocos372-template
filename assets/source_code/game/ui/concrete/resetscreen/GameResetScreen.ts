import { _decorator, Button, Component, Node, sys } from "cc";
import { BaseScreen } from "../../base/BaseScreen";
import { InterfaceManager } from "../../../interfaces/InterfaceManager";
import { IGameStateManager } from "../../../gamestate/IGameStateManager";
import { GameStateManager } from "../../../gamestate/GameStateManager";
import { GameState } from "../../../gamestate/GameStates";
const { ccclass, property } = _decorator;

@ccclass("GameResetScreen")
export class GameResetScreen extends BaseScreen {
  @property(Button)
  private resetBtn: Button = null;

  private gameManager: IGameStateManager;

  protected onShow(): void {
    console.log("Show GameResetScreen");
    super.onShow();
    this.gameManager = InterfaceManager.Instance.getInterface(GameStateManager);

    this.resetBtn.node.on(Button.EventType.CLICK, this.onResetBtnClick, this);
  }
  protected onHide(): void {
    super.onHide();
    this.resetBtn.node.off(Button.EventType.CLICK, this.onResetBtnClick, this);
    console.log("Hide GameResetScreen");
  }

  private onResetBtnClick(): void {
    sys.localStorage.clear();
    this.gameManager.forceChangeGameState(GameState.Home);
  }
}
