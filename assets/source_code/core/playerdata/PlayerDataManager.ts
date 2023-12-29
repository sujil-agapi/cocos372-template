// Assuming the necessary Cocos Creator imports
import { _decorator, Component, sys } from "cc";
import { IPlayerDataManager } from "./IPlayerDataManager";
import { IBootStrapListener } from "../bootstrap/IBootStrapListener";
import { InterfaceManager } from "../interfaces/InterfaceManager";
import { GenericSingleton } from "../utils/GenericSingleton";
const { ccclass, property } = _decorator;

export class PlayerAudioPrefs {
  musicVolume: number = 1;
  sfxVolume: number = 1;
}

export class PlayerProgress {
  levels: PlayerLevelProgressData[] = [];
}

export class PlayerLevelProgressData {}

export abstract class LevelResultData {
  abstract createLevelProgressData(): PlayerLevelProgressData;
}

@ccclass("PlayerDataManager")
export class PlayerDataManager extends GenericSingleton<PlayerDataManager> implements IBootStrapListener, IPlayerDataManager {

  isTypeOfBootStrapListener: boolean = true;

  private readonly key: string = "a8x2DqPjZl9fR5bV";
  private readonly iv: string = "g4sK0tY3wV6eH1zZ";
  private readonly playerPrefsKey: string = "fe-playerData";
  private readonly audioPrefsKey: string = "fe-audioPrefs";

  private cachedProgress: PlayerProgress;
  private cachedAudioPrefs: PlayerAudioPrefs;
  

  updatePlayerLevelData(levelIndex: number, levelResultData: LevelResultData): void {
    
    let progress: PlayerProgress = this.loadPlayerProgress();
    let levelProgressData = levelResultData.createLevelProgressData();
    if (progress.levels.length > levelIndex) {
      progress.levels[levelIndex] = levelProgressData;
    } else {
      progress.levels.push(levelProgressData);
    }
    this.savePlayerProgress(progress);
  }

  lastPlayedLevelIndex(): number {
    this.cachedProgress = this.loadPlayerProgress();
    return this.cachedProgress.levels.length;
  }

  public savePlayerProgress(progress: PlayerProgress): void {
    this.cachedProgress = progress;
    const json = JSON.stringify(progress);
    const encryptedJson = this.encryptString(json);
    sys.localStorage.setItem(this.playerPrefsKey, encryptedJson);
  }

  public loadPlayerProgress(): PlayerProgress {
    if (sys.localStorage.getItem(this.playerPrefsKey)) {
      const encryptedJson = sys.localStorage.getItem(this.playerPrefsKey);
      const decryptedJson = this.decryptString(encryptedJson);
      return JSON.parse(decryptedJson) as PlayerProgress;
    }

    return new PlayerProgress();
  }

  private encryptString(plainText: string): string {
    // Implement proper encryption here
    return btoa(plainText); // Placeholder using Base64
  }

  private decryptString(cipherText: string): string {
    // Implement proper decryption here
    return atob(cipherText); // Placeholder using Base64
  }

  public initialise(): void {
    InterfaceManager.Instance.registerInterface(this);
    this.cachedProgress = this.loadPlayerProgress();
  }

  public resolveDependencies(): void {
    // Implement dependency resolution if needed
  }

  public terminate(): void {
    // Implement termination logic if needed
  }

  public loadAudioPrefs(): PlayerAudioPrefs {
    if (this.cachedAudioPrefs) return this.cachedAudioPrefs;

    if (sys.localStorage.getItem(this.audioPrefsKey)) {
      const encryptedJson = sys.localStorage.getItem(this.audioPrefsKey);
      const decryptedJson = this.decryptString(encryptedJson);
      this.cachedAudioPrefs = JSON.parse(decryptedJson) as PlayerAudioPrefs;
      return this.cachedAudioPrefs;
    }

    return new PlayerAudioPrefs();
  }

  public saveAudioPrefs(prefs: PlayerAudioPrefs): void {
    this.cachedAudioPrefs = prefs;
    const json = JSON.stringify(prefs);
    const encryptedJson = this.encryptString(json);
    sys.localStorage.setItem(this.audioPrefsKey, encryptedJson);
  }

  public updateAudioPreference(musicVol: number, sfxVol: number): void {
    const prefs = this.loadAudioPrefs();
    prefs.musicVolume = musicVol;
    prefs.sfxVolume = sfxVol;
    this.saveAudioPrefs(prefs);
  }

  public getAudioPref(): PlayerAudioPrefs {
    return this.loadAudioPrefs();
  }
}
