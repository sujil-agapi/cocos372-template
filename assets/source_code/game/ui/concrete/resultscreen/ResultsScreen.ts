import { Button, Label, Node, _decorator } from "cc";
import { BaseScreen } from "../../base/BaseScreen";
import { IGameplayManager } from "../../../../gameplay/core/IGameplayManager";
import { InterfaceManager } from "../../../interfaces/InterfaceManager";
import { GameplayManager } from "../../../../gameplay/core/GameplayManager";
import { IGameStateManager } from "../../../gamestate/IGameStateManager";
import { GameStateManager } from "../../../gamestate/GameStateManager";
import { GameState } from "../../../gamestate/GameStates";
import { IPlayerDataManager } from "../../../playerdata/IPlayerDataManager";
import { LevelResultData, PlayerDataManager, PlayerLevelProgressData } from "../../../playerdata/PlayerDataManager";
import { AudioManager } from "../../../audio/AudioManager";
import { IAudioManager } from "../../../audio/IAudioManager";
import { AudioConst } from "../../../audio/AudioConst";

const { ccclass, property } = _decorator;

@ccclass("ResultScreen")
export class ResultScreen extends BaseScreen {

  @property (Label)
  private title : Label;

  @property (Label)
  private body : Label;

  @property (Node)
  private coinsPanel : Node;

  @property (Label)
  private coinsCount : Label;

  @property (Node)
  private confetti : Node;

  @property (Button)
  private btnHome : Button;

  private gameplayManager : IGameplayManager;
  private gameStateManager : IGameStateManager;

  private playerDataManager : IPlayerDataManager;
  private audioManager: IAudioManager;

  protected onShow(): void {
    super.onShow();
    this.confetti.active = false;
    this.gameplayManager = InterfaceManager.Instance.getInterface(GameplayManager);
    this.gameStateManager = InterfaceManager.Instance.getInterface(GameStateManager);
    this.playerDataManager = InterfaceManager.Instance.getInterface(PlayerDataManager);
    this.audioManager = InterfaceManager.Instance.getInterface(AudioManager);

    var isWon = this.gameplayManager.isGameWon;
    isWon? this.setAsWin() : this.setAsLoose();
    this.title.string = isWon? "YOU WON" : "YOU LOST";
    this.body.string = isWon? "GOOD JOB!!" : "TRY AGAIN!!";
    this.coinsPanel.active  = isWon;
    this.confetti.active = isWon;

    this.audioManager.playSFX(isWon ? AudioConst.LevelSuccess : AudioConst.LevelFailure);

    this.btnHome.node.on(Button.EventType.CLICK, this.onHomeBtnClick, this);
  }

  protected onHide(): void {
    super.onHide();
    this.btnHome.node.off(Button.EventType.CLICK, this.onHomeBtnClick, this);
  }
  private setAsWin () : void {
    console.log ("add some coins to the player");
      let loadedPlayerIndex = this.playerDataManager.lastPlayedLevelIndex();
      let levelResultData = new FE_LevelResultData();
      this.playerDataManager.updatePlayerLevelData(loadedPlayerIndex, levelResultData);
  }
  
  private setAsLoose () : void {

  }

  private onHomeBtnClick () : void {
    console.log ("home bnt");
    this.gameStateManager.forceChangeGameState(GameState.Home);
  }
}

class FE_LevelResultData extends LevelResultData {
  createLevelProgressData(): PlayerLevelProgressData {
    return new FE_PlayerLevelProgressData ();
  }
}
class FE_PlayerLevelProgressData extends PlayerLevelProgressData {

}
