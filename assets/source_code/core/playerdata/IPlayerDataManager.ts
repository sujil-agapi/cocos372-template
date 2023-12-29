import { IBase } from "../interfaces/IBase";
import { PlayerProgress, PlayerAudioPrefs, LevelResultData } from "./PlayerDataManager";

export interface IPlayerDataManager extends IBase {
    lastPlayedLevelIndex(): number;
    savePlayerProgress(progress: PlayerProgress): void;
    loadPlayerProgress(): PlayerProgress;
    updatePlayerLevelData(levelIndex: number, levelResultData: LevelResultData): void;
    updateAudioPreference(musicVol: number, sfxVol: number): void;
    getAudioPref(): PlayerAudioPrefs;
}
