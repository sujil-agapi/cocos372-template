import { IBase } from "../interfaces/IBase";
import { LevelData } from "./LevelManager";

export interface ILevelManager  extends IBase {
    getLevel(index: number): LevelData;
    getLevelBasedOnIndex(index: number): LevelData;
}

