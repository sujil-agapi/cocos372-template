import { _decorator, Node } from "cc";
import { IBootStrapListener } from "../bootstrap/IBootStrapListener";
import { GameState } from "../gamestate/GameStates";
import { InterfaceManager } from "../interfaces/InterfaceManager";
import { GenericSingleton } from "../utils/GenericSingleton";
import { IUiManager } from "./IUiManager";
import { BaseScreen } from "./base/BaseScreen";
import { GameEvents } from "../events/GameEvents";
import { GameplayScreen } from "../../game/ui/concrete/gameplayscreen/GameplayScreen";
import { HomeScreen } from "../../game/ui/concrete/homescreen/HomeScreen";
import { GameResetScreen } from "../../game/ui/concrete/resetscreen/GameResetScreen";
import { ResultScreen } from "../../game/ui/concrete/resultscreen/ResultsScreen";
import { SettingsScreen } from "../../game/ui/concrete/settingscreen/SettingsScreen";
import { SplashScreen } from "../../game/ui/concrete/splashScreen/SplashScreen";


const { ccclass, property } = _decorator;

@ccclass("UiManager")
export class UiManager extends GenericSingleton<UiManager> implements IBootStrapListener, IUiManager {
  isTypeOfBootStrapListener: boolean;
  @property([Node])
  private assignableScreens: Node[] = [];

  private availableScreens: Map<string, BaseScreen> = new Map();
  private stateScreenMap: Map<GameState, BaseScreen> = new Map();
  private wasOverlayState: boolean = false;

  public initialise(): void {
    this.configure();
    InterfaceManager.Instance.registerInterface(this); // Adjust based on your project
    GameEvents.onGameStateChange.on(
      ({ prevState, newState, isOverlayState }) => {
        this.gameEventsOnOnGameStateChange(prevState, newState, isOverlayState);
      }
    );
    this.stateScreenMap.set(GameState.Splash, this.getScreen(SplashScreen));
    this.stateScreenMap.set(GameState.Home, this.getScreen(HomeScreen));
    this.stateScreenMap.set(GameState.Gameplay, this.getScreen(GameplayScreen));
    this.stateScreenMap.set(GameState.Result, this.getScreen(ResultScreen));
    this.stateScreenMap.set(GameState.Settings, this.getScreen(SettingsScreen));
    this.stateScreenMap.set(GameState.Reset, this.getScreen(GameResetScreen));
  }

  public resolveDependencies(): void {
    // Implement as needed
  }

  public terminate(): void {
    GameEvents.onGameStateChange.off(
      ({ prevState, newState, isOverlayState }) => {
        this.gameEventsOnOnGameStateChange(prevState, newState, isOverlayState);
      }
    );
  }

  private gameEventsOnOnGameStateChange(prevState: GameState, newState: GameState, isOverlayState: boolean): void {
    if (!isOverlayState) {
      let screenToDeactivate = this.stateScreenMap.get(prevState);
      if(screenToDeactivate)
          screenToDeactivate.deactivate();
    }
    if (!this.wasOverlayState) {
      let screenToActivate = this.stateScreenMap.get(newState);
      if(screenToActivate)
        screenToActivate.activate();
    }
    this.wasOverlayState = isOverlayState;
  }

  private configure(): void {
    this.availableScreens = new Map<string, BaseScreen>();
    this.assignableScreens.forEach((panel) => {
      let baseScreen = panel.getComponent(BaseScreen);
      baseScreen?.deactivate();
      let typeName = baseScreen ? baseScreen.constructor.name : "Unknown";
      this.availableScreens.set(typeName, baseScreen);
    });
  }

  public activate<T extends BaseScreen>(
    type: new (...args: any[]) => T,
    ...args: any[]
  ): void {
    let typeName = this.getTypeName(type);
    let baseScreen = this.availableScreens.get(typeName);
    baseScreen?.activate(...args);
  }

  public deactivate<T extends BaseScreen>(
    type: new (...args: any[]) => T
  ): void {
    let typeName = this.getTypeName(type);
    let baseScreen = this.availableScreens.get(typeName);
    baseScreen?.deactivate();
  }

  public getScreen<T extends BaseScreen>(
    type: new (...args: any[]) => T
  ): T | null {
    let typeName = this.getTypeName(type);
    return this.availableScreens.get(typeName) as T | null;
  }

  private getTypeName<T extends BaseScreen>(
    type: new (...args: any[]) => T
  ): string {
    return type.name;
  }
}
