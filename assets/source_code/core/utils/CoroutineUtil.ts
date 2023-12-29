import { director, Component } from 'cc';

export class CoroutineUtil extends Component {
    private static instance: CoroutineUtil;
    private scheduledCallbacks: Map<string, Function> = new Map();

    private constructor() {
        super();
    }

    public static getInstance(): CoroutineUtil {
        if (!this.instance) {
            this.instance = new CoroutineUtil();
        }
        return this.instance;
    }

    private generateKey(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    public delay(delayInSeconds: number, finishedCallback: () => void): string {
        if (delayInSeconds < 0) {
            console.error("Delay cannot be negative");
            return;
        }

        const key = this.generateKey();
        const callback = () => {
            if (this.scheduledCallbacks.has(key)) {
                finishedCallback();
                this.scheduledCallbacks.delete(key);
            }
        };

        this.scheduledCallbacks.set(key, callback);
        director.getScheduler().schedule(callback, this, delayInSeconds, 0, 0, false);
        return key; // Return the key for reference
    }

    public cancelCoroutine(key: string): void {
        const callback = this.scheduledCallbacks.get(key);
        if (callback) {
            director.getScheduler().unschedule(callback, this);
            this.scheduledCallbacks.delete(key);
        } else {
            console.warn("Coroutine with the given key does not exist or has already finished.");
        }
    }

    public delayRealtime(delayInSeconds: number, finishedCallback: () => void): string {
        if (typeof setTimeout === 'undefined') {
            console.error('setTimeout is not available in this environment.');
            return;
        }

        if (delayInSeconds < 0) {
            console.error("Delay cannot be negative");
            return;
        }

        const key = this.generateKey();
        const timeoutId = setTimeout(() => {
            if (this.scheduledCallbacks.has(key)) {
                finishedCallback();
                this.scheduledCallbacks.delete(key);
            }
        }, delayInSeconds * 1000);

        this.scheduledCallbacks.set(key, () => clearTimeout(timeoutId));
        return key; // Return the key for reference
    }

    public waitFrames(frames: number, finishedCallback: () => void): string {
        if (frames < 0) {
            console.error("Frame count cannot be negative");
            return;
        }

        const key = this.generateKey();
        let frameCount = 0;
        const callback = () => {
            frameCount++;
            if (frameCount >= frames) {
                if (this.scheduledCallbacks.has(key)) {
                    finishedCallback();
                    this.scheduledCallbacks.delete(key);
                    director.getScheduler().unschedule(callback, this);
                }
            }
        };

        this.scheduledCallbacks.set(key, callback);
        director.getScheduler().schedule(callback, this, 0, 0, 0, false);
        return key; // Return the key for reference
    }
}