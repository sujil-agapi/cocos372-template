import {
  _decorator,
  Button,
} from "cc";
import { AudioConst } from "../../../../core/audio/AudioConst";
import { AudioManager } from "../../../../core/audio/AudioManager";
import { IAudioManager } from "../../../../core/audio/IAudioManager";
import { GameStateManager } from "../../../../core/gamestate/GameStateManager";
import { GameState } from "../../../../core/gamestate/GameStates";
import { IGameStateManager } from "../../../../core/gamestate/IGameStateManager";
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { IPlayerDataManager } from "../../../../core/playerdata/IPlayerDataManager";
import { PlayerDataManager } from "../../../../core/playerdata/PlayerDataManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";

const { ccclass, property } = _decorator;

@ccclass("HomeScreen")
export class HomeScreen extends BaseScreen {
  @property(Button)
  private playButton: Button | null = null;

  @property(Button)
  private settingsButton: Button | null = null;

  private gameStateManager: IGameStateManager;
  private audioManager: IAudioManager;

  private playerDataManager: IPlayerDataManager;

  protected onShow(): void {
    super.onShow();

    this.gameStateManager = InterfaceManager.Instance.getInterface(GameStateManager);
    this.audioManager = InterfaceManager.Instance.getInterface(AudioManager);
    this.playerDataManager = InterfaceManager.Instance.getInterface(PlayerDataManager);

    if (this.playButton) {
      this.playButton.node.on(Button.EventType.CLICK, this.onPlayClicked, this);
    }

    if (this.settingsButton) {
      this.settingsButton.node.on(
        Button.EventType.CLICK,
        this.onSettingsClicked,
        this
      );
    }
  }

  protected onHide(): void {
    super.onHide();

    if (this.playButton) {
      this.playButton.node.off(
        Button.EventType.CLICK,
        this.onPlayClicked,
        this
      );
    }

    if (this.settingsButton) {
      this.settingsButton.node.off(
        Button.EventType.CLICK,
        this.onSettingsClicked,
        this
      );
    }
  }

  private onPlayClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);
    this.gameStateManager.forceChangeGameState(GameState.Gameplay);
  }

  private onSettingsClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);
    this.gameStateManager.forceChangeGameState(GameState.Settings);
  }
}
