export class EventEmitter<T> {
    private listeners: ((eventData: T) => void)[] = [];

    public on(listener: (eventData: T) => void): void {
        this.listeners.push(listener);
    }

    public off(listener: (eventData: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public emit(eventData: T): void {
        this.listeners.forEach(listener => listener(eventData));
    }
}