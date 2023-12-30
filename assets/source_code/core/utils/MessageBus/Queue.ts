
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Queue')
export class Queue<T> {
    protected headIndex = 0;
    protected tailIndex = 0;
    protected _length = 0;
    protected initialCapacity = 0;
    protected currentCapacity = 0;
    protected container: T[] = [];

    public constructor(initialCapacity = 10) {
        this.initialCapacity = initialCapacity;
        this.currentCapacity = initialCapacity;
        this.container.length = initialCapacity;
    }

    public enqueue(element: T) {
        if (this._length >= this.currentCapacity) {
            this.expand();
        }
        this.container[this.tailIndex] = element;
        this._length++;
        this.tailIndex++;
        if (this.tailIndex === this.currentCapacity) {
            this.tailIndex = 0;
        }
    }

    public dequeue(): T {
        if (this._length <= 0) {
            return null;
        }
        const tmp = this.container[this.headIndex];
        this.headIndex++;
        this._length--;
        if (this.headIndex === this.currentCapacity) {
            this.headIndex = 0;
        }
        if (this._length === this.currentCapacity / 4 && this._length > this.initialCapacity) {
            this.shrink();
        }
        return tmp;
    }

    public peek(): T {
        if (this._length === 0) {
            return null;
        }
        return this.container[this.headIndex];
    }

    public get length(): number {
        return this._length;
    }

    public get isEmpty(): boolean {
        return this._length <= 0;
    }

    public indexOf(element): number {
        return this.container.indexOf(element);
    }
    

    protected expand() {
        var currentSource = this.headIndex;
        var currentTarget = 0;
        var newContainer: T[] = [];
        newContainer.length = 2 * this.currentCapacity;

        while (currentTarget < this.currentCapacity) {
            newContainer[currentTarget] = this.container[currentSource];
            currentSource++;
            currentTarget++;
            if (currentSource === this.currentCapacity) {
                currentSource = 0;
            }
        }
        this.container = newContainer;
        this.headIndex = 0;
        this.tailIndex = this.currentCapacity;
        this.currentCapacity *= 2;
    }

    protected shrink() {
        var currentSource = this.headIndex;
        var currentTarget = 0;
        var newContainer: T[] = [];
        newContainer.length = this.currentCapacity / 4;

        while (currentTarget < this.currentCapacity) {
            newContainer[currentTarget] = this.container[currentSource];
            currentSource++;
            currentTarget++;
            if (currentSource === this.currentCapacity) {
                currentSource = 0;
            }
        }
        this.container = newContainer;
        this.headIndex = 0;
        this.tailIndex = this.currentCapacity;
        this.currentCapacity /= 4;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
