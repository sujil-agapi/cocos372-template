import { _decorator, Button, Component, Label, Node, random, tween, Tween, Vec3 } from 'cc';
import { BaseScreen } from '../../base/BaseScreen';
import { AudioManager } from '../../../audio/AudioManager';
import { IAudioManager } from '../../../audio/IAudioManager';
import { GameStateManager } from '../../../gamestate/GameStateManager';
import { IGameStateManager } from '../../../gamestate/IGameStateManager';
import { InterfaceManager } from '../../../interfaces/InterfaceManager';
import { AudioConst } from '../../../audio/AudioConst';
import { GameState } from '../../../gamestate/GameStates';
import { IPlayerDataManager } from '../../../playerdata/IPlayerDataManager';
import { PlayerDataManager } from '../../../playerdata/PlayerDataManager';

const { ccclass, property } = _decorator;

@ccclass("HomeScreen")
export class HomeScreen extends BaseScreen {
  @property(Label)
  private coinsCount: Label | null = null;

  @property(Label)
  private acheivementCount: Label | null = null;

  @property(Button)
  private playButton: Button | null = null;

  @property(Button)
  private settingsButton: Button | null = null;

  @property(Button)
  private avatarsButton: Button | null = null;

  @property (Button)
  private avatarsCloseBtn : Button | null = null;

  @property (Node)
  private avatarsNode : Node;

  private gameStateManager: IGameStateManager;
  private audioManager: IAudioManager;

  private playerDataManager: IPlayerDataManager;

  protected onShow(): void {
    super.onShow();

    this.gameStateManager =
      InterfaceManager.Instance.getInterface(GameStateManager);
    this.audioManager = InterfaceManager.Instance.getInterface(AudioManager);
    this.playerDataManager =
      InterfaceManager.Instance.getInterface(PlayerDataManager);

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

    if (this.avatarsButton) {
      this.avatarsButton.node.on(
        Button.EventType.CLICK,
        this.onAvatarsClicked,
        this
      );
    }

    if (this.avatarsCloseBtn) {
        this.avatarsCloseBtn.node.on(
          Button.EventType.CLICK,
          this.onAvatarsCloseBtnClicked,
          this
        );
      }

    const coins = this.playerDataManager.lastPlayedLevelIndex();
    const achievements = Math.floor(coins / 10);

    if (this.coinsCount) {
      this.coinsCount.string = coins.toString();
    }
    if (this.acheivementCount) {
      this.acheivementCount.string = achievements.toString();
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

    if (this.avatarsButton) {
      this.avatarsButton.node.off(
        Button.EventType.CLICK,
        this.onAvatarsClicked,
        this
      );
    }

    if (this.avatarsCloseBtn) {
        this.avatarsCloseBtn.node.off(
          Button.EventType.CLICK,
          this.onAvatarsCloseBtnClicked,
          this
        );
      }
  }

  private onPlayClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);
    console.log("Play button clicked");

    try {
      this.gameStateManager.forceChangeGameState(GameState.Gameplay);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  }

  private onSettingsClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);

    this.gameStateManager.forceChangeGameStateNew(GameState.Settings);
    // Implement settings button functionality
    console.log("Settings button clicked");
  }

  private onAvatarsClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);
    // Implement avatars button functionality
    console.log("Avatars button clicked");
    this.avatarsNode.active = true;
  }

  private onAvatarsCloseBtnClicked() {
    this.audioManager.playSFX(AudioConst.ButtonClick);
    console.log("Avatars button closed");
    this.avatarsNode.active = false;
  }
}
