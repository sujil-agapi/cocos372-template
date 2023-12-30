import { error, log, warn } from "cc";

export default class EventDispatcher implements EventTarget {
    public constructor() { }

    private _listeners: {
        [type: string]: Array<EventListenerType>;
    } = undefined;

    public clearListeners(){
        this._listeners = {};
    }
    /**
     * Adds an event listener to the target.
     * @param type The name of the event.
     * @param handler The handler for the event. This is called when the event
     * is dispatched.
     */
    public addEventListener(type: string, handler: EventListenerType) {
        if (!this._listeners) this._listeners = {};

        if (!(type in this._listeners)) {
            this._listeners[type] = [handler];
        } else {
            const handlers = this._listeners[type];
            if (handlers.indexOf(handler) < 0) handlers.push(handler);
        }
    }

    /**
     * Removes an event listener from the target.
     * @param type The name of the event.
     * @param handler  The handler for the event.
     */
    public removeEventListener(type: string, handler: EventListenerType) {
        if (!this._listeners) return;
        if (!(type in this._listeners)) return;

        const handlers = this._listeners[type];
        const index = handlers.indexOf(handler);
        if (index >= 0) {
            // Clean up if this was the last listener.
            if (handlers.length === 1) delete this._listeners[type];
            else handlers.splice(index, 1);
        }
    }

    /**
     * Dispatches an event and calls all the listeners that are listening to
     * the type of the event.
     * @param event The event to dispatch.
     * @returns Whether the default action was prevented. If someone calls
     * preventDefault on the event object then this returns false.
     */
    public dispatchEvent(event: Event, data?: any): boolean {
        if (!this._listeners) return true;

        const type = event.type;
        let prevented = false;
        if (type in this._listeners) {
            // Close to prevent removal during dispatch, use if there is error, some performance can be affected
            // const handlers = this._listeners[type].concat();
            const handlers = this._listeners[type];
            for (let i = 0, handler; (handler = handlers[i]); i++) {
                if (handler.handlerEvent) {
                    try {
                        let p =
                            handler.handlerEvent.call(handler, event, data) ===
                            false;
                        prevented = prevented || p;
                    } catch (e) {
                        console.warn(e);
                    }
                } else {
                    try {
                        let p = handler.call(handler, event, data) === false;
                        prevented = prevented || p;
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }
        }

        return !prevented && !event.defaultPrevented;
    }
}

export type EventListenerType = EventListener | ((event: Event, data?: any) => void);
