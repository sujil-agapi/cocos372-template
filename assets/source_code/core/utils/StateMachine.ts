import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

type Function = () => void;

@ccclass('StateMachine')
export class StateMachine extends Component {

    private currentState: number = -1;
    private nextState: number = -1;
    private lastState: number = -1;

    private debug: boolean = false;

    private onEnterFunc: Function[];
    private onExitFunc: Function[];
    private onUpdateFunc: Function[];

    private time: number = 0;

    constructor(nStates: number, debug: boolean = false) {
        super();
        this.onEnterFunc = new Array(nStates);
        this.onExitFunc = new Array(nStates);
        this.onUpdateFunc = new Array(nStates);

        this.debug = debug;
    }

    registerState(state: number, onEnter: Function | null = null, onUpdate: Function | null = null, onExit: Function | null = null) {
        this.onEnterFunc[state] = onEnter;
        this.onExitFunc[state] = onExit;
        this.onUpdateFunc[state] = onUpdate;
    }

    setState(state: number) {
        this.nextState = state;
        if (this.debug) console.log("SET From " + this.currentState + " to " + this.nextState);
    }

    isState(state: number): boolean {
        return this.currentState === state;
    }

    getState(): number {
        return this.currentState;
    }

    getLastState(): number {
        return this.lastState;
    }

    getStateTime(): number {
        return this.time;
    }

    update(dt: number) {
        this.time += dt;
        if (this.currentState !== this.nextState) {
            if (this.currentState >= 0) {
                this.execute(this.onExitFunc[this.currentState]); // OnExit
            }
            if (this.debug) console.log("From " + this.currentState + " to " + this.nextState);
            this.lastState = this.currentState;
            this.currentState = this.nextState;
            this.execute(this.onEnterFunc[this.currentState]); // OnEnter
            this.time = 0;
        }
        this.execute(this.onUpdateFunc[this.currentState]); // OnUpdate
    }

    private execute(f: Function | null) {
        if (f !== null) {
            if (typeof f === 'function') {
                f();
            } else {
                if (this.debug) {
                    console.error(`Attempted to execute a non-function:`, f);
                }
            }
        }
    }
}
