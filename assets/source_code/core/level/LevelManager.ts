import { _decorator, resources } from "cc";
import { IBootStrapListener } from "../bootstrap/IBootStrapListener";
import { InterfaceManager } from "../interfaces/InterfaceManager";
import { GenericSingleton } from "../utils/GenericSingleton";
import { ILevelManager } from "./ILevelManager";
const { ccclass, property } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends GenericSingleton<LevelManager> implements IBootStrapListener, ILevelManager {

  isTypeOfBootStrapListener: boolean = true;

  private levelsContainer: LevelsContainer = null;
  private readonly LEVEL_JSON_PATH : string = 'data/level/levels';

  getLevel(index: number): LevelData {
    if (index >= 0 && index < this.levelsContainer.levels.length) {
      return this.levelsContainer.levels[index];
    }
    return null;
  }

  initialise(): void {
    this.loadLevelsFromJson(this.LEVEL_JSON_PATH);
    InterfaceManager.Instance.registerInterface(this);
  }

  resolveDependencies(): void {}
  terminate(): void {}

  loadLevelsFromJson(levelJson: string): void {
    resources.load(levelJson, (err, asset) => {
      if (err) {
        console.error("Failed to load levels:", err);
        return;
      }
      if (asset) {
        const data = asset.json as unknown as { levels: JsonLevelData[] };
        this.levelsContainer = new LevelsContainer();
        this.levelsContainer.levels = data.levels.map(
          (levelData: JsonLevelData) => {
            const level = new LevelData();
            level.sample_item = levelData.sample_item;
            return level;
          }
        );
      }
    });
  }
}

interface JsonLevelData {
  sample_item: number;
}

export class LevelsContainer {
  @property
  public levels: LevelData[] = [];
}
export class LevelData {
  @property
  sample_item: number;
}
