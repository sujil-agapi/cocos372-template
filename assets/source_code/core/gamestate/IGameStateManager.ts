import { Component } from "cc";
import { GameState } from "./GameStates";

export interface IGameStateManager extends Component {
    readonly currentGameState: GameState;
    forceChangeGameState(newState: GameState): void;
    forceChangeGameStateNew(newState: GameState): void;
}
