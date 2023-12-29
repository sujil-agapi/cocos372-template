import { _decorator, resources } from "cc";
import { IBootStrapListener } from "../bootstrap/IBootStrapListener";
import { InterfaceManager } from "../interfaces/InterfaceManager";
import { GenericSingleton } from "../utils/GenericSingleton";
import { ILevelManager } from "./ILevelManager";
const { ccclass, property } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends GenericSingleton<LevelManager> implements IBootStrapListener, ILevelManager {
  getLevelBasedOnIndex(index: number): LevelData {
    if (index >= 0 && index < this.levelsContainer.levels.length) {
      return this.levelsContainer.levels[index];
    }
    return null;
  }

  isTypeOfBootStrapListener: boolean = true;
    
  private levelsContainer: LevelsContainer = new LevelsContainer();

  getLevel(index: number): LevelData {
    if (index >= 0 && index < this.levelsContainer.levels.length) {
      return this.levelsContainer.levels[index];
    }
    return null;
  }

  initialise(): void {
    InterfaceManager.Instance.registerInterface(this);
    this.generateLevels();
    console.log ("Generated levels");
  }

  resolveDependencies(): void {}

  terminate(): void {}

  generateLevels(): void {
    const numberOfLevels = 100;
    for (let i = 0; i < numberOfLevels; i++) {
      this.levelsContainer.levels.push(new LevelData(i));
    }
  }
}

export class LevelsContainer {
  @property
  public levels: LevelData[] = [];
}
export class LevelData {
  @property
  public turn_duration: number;

  @property
  public col_row_count: number = 0;

  @property
  public difficulty: number = 0;

  constructor(levelNumber: number) {
    this.turn_duration = Math.max(15 - Math.floor(levelNumber / 5), 8);
    this.difficulty = Math.floor(Math.random() * 11); // Random number between 0 to 10
    if (levelNumber < 50) {
      this.col_row_count = 7 + Math.floor(Math.random() * 2); // Random number between 7 and 8
    } else {
      this.col_row_count = Math.floor(Math.random() * 3) + 5; // Random number between 5 to 7
    }
  }
}
