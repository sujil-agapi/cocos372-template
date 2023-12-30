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
  private readonly LEVEL_JSON_PATH: string = 'data/level/levels';

  getLevel(index: number): LevelData {
    if (!this.levelsContainer || this.levelsContainer.levels.length === 0) {
      return this.createDefaultLevel(); // Return default level if JSON is missing or empty
    }
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
    console.log("Loading levels from JSON:", levelJson);

    try {
      resources.load(levelJson, (err, asset) => {
        if (err) {
          console.error("Failed to load levels:", err);
          this.levelsContainer = new LevelsContainer();
          this.levelsContainer.levels.push(this.createDefaultLevel()); // Create default level if JSON fails to load
          return;
        }
        console.log("Loaded Asset:", asset);
        if (asset) {
          const data = asset.json as unknown as { levels: JsonLevelData[] };
          this.levelsContainer = new LevelsContainer();
          this.levelsContainer.levels = data.levels.map((levelData: JsonLevelData) => {
            const level = new LevelData();
            level.sample_item = levelData.sample_item;
            return level;
          });
        } else {
          console.error("Asset is null or not a valid JSON.");
          this.levelsContainer = new LevelsContainer();
          this.levelsContainer.levels.push(this.createDefaultLevel());
        }
      });
    }
    catch (caughtError){
      console.log(caughtError.message);
      this.levelsContainer = new LevelsContainer();
      this.levelsContainer.levels.push(this.createDefaultLevel());
    }
  }
  

  private createDefaultLevel(): LevelData {
    const defaultLevel = new LevelData();
    defaultLevel.sample_item = 0; // Set the default value for sample_item
    return defaultLevel;
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
