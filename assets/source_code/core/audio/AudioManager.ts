import { _decorator, AudioClip, AudioSource, Component, Node, tween } from "cc";
import { AudioConst } from "./AudioConst";
import { IBootStrapListener } from "../bootstrap/IBootStrapListener";
import { GameEvents } from "../events/GameEvents";
import { GameState } from "../gamestate/GameStates";
import { InterfaceManager } from "../interfaces/InterfaceManager";
import { IPlayerDataManager } from "../playerdata/IPlayerDataManager";
import { PlayerDataManager } from "../playerdata/PlayerDataManager";
import { GenericSingleton } from "../utils/GenericSingleton";
import { AudioLibrary } from "./AudioLibrary";
import { IAudioManager } from "./IAudioManager";
const { ccclass, property } = _decorator;

//TODO - Add lazy loading

@ccclass("AudioManager")
export class AudioManager extends GenericSingleton<AudioManager> implements IAudioManager, IBootStrapListener {
  isTypeOfBootStrapListener: boolean = true;
  @property(AudioLibrary)
  private audioLibrary: AudioLibrary = null;

  @property(AudioSource)
  private musicSource: AudioSource = null;

  @property(AudioSource)
  private sfxSource: AudioSource = null;

  private playerDataManager: IPlayerDataManager;
  private isCrossfading: boolean = false;

  private crossfadeDuration: number = 5.0; // Duration in seconds

  playMusic(key: string): void {
    const clipToPlay: AudioClip = this.audioLibrary.getBGClipByKey(key);
    if (clipToPlay) {
      if (
        !this.musicSource.clip ||
        this.musicSource.clip.name !== clipToPlay.name
      ) {
        if (!this.musicSource.clip) {
          this.musicSource.clip = clipToPlay;
          this.musicSource.volume =
            this.playerDataManager.getAudioPref().musicVolume;

        this.musicSource.loop = true;
        this.musicSource.play();
        } else {
          this.crossFadeMusic(clipToPlay);
        }
      }
    } else {
      console.error(`No background music found for key: ${key}`);
    }
  }

  crossFadeMusic(newClip: AudioClip) {
    if (this.isCrossfading) {
      return;
    }

    this.isCrossfading = true;

    const originalVolume = this.musicSource.volume;
    const newMusicSource = this.node.addComponent(AudioSource);
    newMusicSource.clip = newClip;
    newMusicSource.volume = 0;
    newMusicSource.loop = true;
    newMusicSource.play();

    const globalMusicVolume = this.playerDataManager.getAudioPref().musicVolume;

    tween(this.musicSource).to(this.crossfadeDuration, { volume: 0 }).start();

    tween(newMusicSource)
      .to(this.crossfadeDuration, {
        volume: originalVolume * globalMusicVolume,
      })
      .call(() => {
        this.musicSource.stop();
        this.musicSource.destroy();
        this.musicSource = newMusicSource;
        this.isCrossfading = false;
      })
      .start();
  }

  playSFX(key: string): void {
    const sfxToPlay: AudioClip = this.audioLibrary.getSFXClipByKey(key);
    if (sfxToPlay) {
      this.sfxSource.playOneShot(sfxToPlay);
    } else {
      console.error(`No sound effect found for key: ${key}`);
    }
  }

  updateSFXVolume(vol: number): void {
    this.sfxSource.volume = vol;
  }

  updateMusicVolume(vol: number): void {
    this.musicSource.volume = vol;
  }

  initialise(): void {
    InterfaceManager.Instance.registerInterface(this);
    GameEvents.onGameStateChange.on(
      ({ prevState, newState, isOverlayState }) => {
        this.gameEventsOnOnGameStateChange(prevState, newState, isOverlayState);
      }
    );
  }

  private gameEventsOnOnGameStateChange(prevState: GameState, newState: GameState, isOverlayState: boolean): void {
    switch (newState) {
      case GameState.Home:
        this.playMusic(AudioConst.HomeMusic);
        break;
      case GameState.Gameplay:
        this.playMusic(AudioConst.GameplayMusic);
        break;
    }
  }

  resolveDependencies(): void {
    this.playerDataManager =
      InterfaceManager.Instance.getInterface(PlayerDataManager);
    const audioPref = this.playerDataManager.getAudioPref();
    this.sfxSource.volume = audioPref.sfxVolume;
    this.musicSource.volume = audioPref.musicVolume;
  }

  terminate(): void {
    GameEvents.onGameStateChange.off(
      ({ prevState, newState, isOverlayState }) => {
        this.gameEventsOnOnGameStateChange(prevState, newState, isOverlayState);
      }
    );
  }
}
