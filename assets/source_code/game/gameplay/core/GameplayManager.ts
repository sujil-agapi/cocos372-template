import { _decorator, Component, Node, tween } from "cc";
import { IBootStrapListener } from "../../../core/bootstrap/IBootStrapListener";
import { GameEvents } from "../../../core/events/GameEvents";
import { GameStateManager } from "../../../core/gamestate/GameStateManager";
import { GameState } from "../../../core/gamestate/GameStates";
import { InterfaceManager } from "../../../core/interfaces/InterfaceManager";
import { ILevelManager } from "../../../core/level/ILevelManager";
import { LevelManager, LevelData } from "../../../core/level/LevelManager";
import { IPlayerDataManager } from "../../../core/playerdata/IPlayerDataManager";
import { PlayerDataManager } from "../../../core/playerdata/PlayerDataManager";
import { GenericSingleton } from "../../../core/utils/GenericSingleton";
import { IGameplayManager } from "./IGameplayManager";
import { StateMachine } from "../../../core/utils/StateMachine";
const { ccclass, property } = _decorator;

export const gameEvents = new EventTarget();

@ccclass("GameplayManager")
export class GameplayManager extends GenericSingleton<GameplayManager> implements IBootStrapListener, IGameplayManager {

  isTypeOfBootStrapListener: boolean = true;
  loadedLevelData: LevelData;
  allowedTurnTime: Number = 10;
  isGameWon: boolean = false;

  private gameStateManager: GameStateManager;
  private levelManager: ILevelManager;
  private playerDataManager: IPlayerDataManager;

  initialise(): void {
    InterfaceManager.Instance.registerInterface(this); // Adjust based on your project
    GameEvents.onGameStateChange.on(
      ({ prevState, newState, isOverlayState }) => {
        this.gameEventsOnOnGameStateChange(prevState, newState, isOverlayState);
      }
    );


  }
  resolveDependencies(): void {
    this.gameStateManager =
      InterfaceManager.Instance.getInterface(GameStateManager);
    this.levelManager = InterfaceManager.Instance.getInterface(LevelManager);
    this.playerDataManager =
      InterfaceManager.Instance.getInterface(PlayerDataManager);
  }

  setGameStatus(isWon: boolean): void {
    this.isGameWon = isWon;
    this.gameStateManager.forceChangeGameState(GameState.Result);
  }
  terminate(): void {}

  private gameEventsOnOnGameStateChange(prevState: GameState, newState: GameState, isOverlayState: boolean): void {
    switch (newState) {
      case GameState.Gameplay:
        this.startGamePlay();
        break;
      case GameState.Result:
        if (prevState == GameState.Gameplay) this.endGameplay();
        break;
      case GameState.Home:
        if (prevState == GameState.Gameplay) this.endGameplay();
        break;
    }
  }

  private startGamePlay(): void {}

  private endGameplay(): void {}
}
