import { GameState } from "../gamestate/GameStates";
import { EventEmitter } from "./EventEmitter";

export class GameEvents {
    public static onGameStateChange = new EventEmitter<{ prevState: GameState, newState: GameState, isOverlayState: boolean }>();
    public static onGameplayLevelGenerated = new EventEmitter<number>();
    public static onGameplayLevelDestroyed = new EventEmitter<void>();
    public static onScoreChange = new EventEmitter<number>();
    public static onTurnsCountChange = new EventEmitter<number>();
    public static onComboReceived = new EventEmitter<number>();

    public static dispatchGameStateChanged(prevState: GameState, newState: GameState, isOverlayState: boolean) {
        this.onGameStateChange.emit({ prevState, newState, isOverlayState });
    }
    public static dispatchLevelGenerated(updatedOrthoValue: number) {
        this.onGameplayLevelGenerated.emit(updatedOrthoValue);
    }
    public static dispatchLevelDestroyed() {
        this.onGameplayLevelDestroyed.emit();
    }
    public static dispatchScoreChange(score: number) {
        this.onScoreChange.emit(score);
    }
}