import { Button, Label, Node, _decorator } from "cc";
import { AudioConst } from "../../../../core/audio/AudioConst";
import { AudioManager } from "../../../../core/audio/AudioManager";
import { IAudioManager } from "../../../../core/audio/IAudioManager";
import { GameStateManager } from "../../../../core/gamestate/GameStateManager";
import { GameState } from "../../../../core/gamestate/GameStates";
import { IGameStateManager } from "../../../../core/gamestate/IGameStateManager";
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { IPlayerDataManager } from "../../../../core/playerdata/IPlayerDataManager";
import {
  PlayerDataManager,
  LevelResultData,
  PlayerLevelProgressData,
} from "../../../../core/playerdata/PlayerDataManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";
import { GameplayManager } from "../../../gameplay/core/GameplayManager";
import { IGameplayManager } from "../../../gameplay/core/IGameplayManager";

const { ccclass, property } = _decorator;

@ccclass("ResultScreen")
export class ResultScreen extends BaseScreen {
  @property(Label)
  private titleMessage: Label;

  @property(Label)
  private bodyMessage: Label;

  @property(Button)
  private btnHome: Button;

  private gameplayManager: IGameplayManager;
  private gameStateManager: IGameStateManager;

  private playerDataManager: IPlayerDataManager;
  private audioManager: IAudioManager;

  private readonly WON_TITLE_MESSAGE: string = "YOU WON";
  private readonly LOST_TITLE_MESSAGE: string = "YOU LOST";

  private readonly WON_BODY_MESSAGE: string = "GOOD JOB!!";
  private readonly LOST_BODY_MESSAGE: string = "TRY AGAIN!!";

  protected onShow(): void {
    super.onShow();
    this.gameplayManager =
      InterfaceManager.Instance.getInterface(GameplayManager);
    this.gameStateManager =
      InterfaceManager.Instance.getInterface(GameStateManager);
    this.playerDataManager =
      InterfaceManager.Instance.getInterface(PlayerDataManager);
    this.audioManager = InterfaceManager.Instance.getInterface(AudioManager);

    var isWon = this.gameplayManager.isGameWon;
    isWon ? this.setAsWin() : this.setAsLoose();
    this.titleMessage.string = isWon
      ? this.WON_TITLE_MESSAGE
      : this.LOST_TITLE_MESSAGE;
    this.bodyMessage.string = isWon
      ? this.WON_BODY_MESSAGE
      : this.LOST_BODY_MESSAGE;

    this.audioManager.playSFX(
      isWon ? AudioConst.LevelSuccess : AudioConst.LevelFailure
    );
    this.btnHome.node.on(Button.EventType.CLICK, this.onHomeBtnClick, this);
  }

  protected onHide(): void {
    super.onHide();
    this.btnHome.node.off(Button.EventType.CLICK, this.onHomeBtnClick, this);
  }
  private setAsWin(): void {
    console.log("add some coins to the player");
    let loadedPlayerIndex = this.playerDataManager.lastPlayedLevelIndex();
    let levelResultData = new MiniGameLevelResultData();
    this.playerDataManager.updatePlayerLevelData(
      loadedPlayerIndex,
      levelResultData
    );
  }

  private setAsLoose(): void {}

  private onHomeBtnClick(): void {
    console.log("home bnt");
    this.gameStateManager.forceChangeGameState(GameState.Home);
  }
}

class MiniGameLevelResultData extends LevelResultData {
  createLevelProgressData(): PlayerLevelProgressData {
    return new MiniGamePlayerLevelProgressData();
  }
}
class MiniGamePlayerLevelProgressData extends PlayerLevelProgressData {}
