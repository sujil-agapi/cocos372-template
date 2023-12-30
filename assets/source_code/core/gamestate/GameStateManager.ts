import { _decorator, Component, Node, tween } from 'cc';
import { IGameStateManager } from './IGameStateManager';
import { GameState } from './GameStates';
import { IBootStrapListener } from '../bootstrap/IBootStrapListener';
import { InterfaceManager } from '../interfaces/InterfaceManager';
import { GameEvents } from '../events/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('GameStateManager')
export class GameStateManager extends Component implements IBootStrapListener, IGameStateManager {
    
    isTypeOfBootStrapListener: boolean = true;
    currentGameState: GameState;

    initialise(): void {
      InterfaceManager.Instance.registerInterface(this);
    }
    resolveDependencies(): void {
      this.setGameStateToSplash();
    }
    terminate(): void {
     //throw new Error("Method not implemented.");
    }
 
    forceChangeGameState(newState: GameState): void {
      this.setGameState(newState, newState === GameState.Settings);
    }
  
    private setGameStateToSplash(): void {
      this.setGameState(GameState.Splash);
      tween(this.node)
        .delay(2)
        .call(() => {
          this.setGameStateToHomeScreen();
        })
        .start();
    }
  
    private setGameStateToHomeScreen(): void {
      this.setGameState(GameState.Home);
    }
  
    private setGameState(newGameState: GameState, isOverlay: boolean = false): void {
      if (this.currentGameState !== newGameState) {
        GameEvents.dispatchGameStateChanged(
          this.currentGameState,
          newGameState,
          isOverlay
        );
        this.currentGameState = newGameState;
      }
    }
}

