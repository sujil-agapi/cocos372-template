import { _decorator, Component, Node, error, warn, log, game } from 'cc';
import EventDispatcher, { EventListenerType } from './EventDispatcher';
import { MessageType } from './MessageType';
import { Queue } from './Queue';
import { director } from 'cc';
const { ccclass, property, executionOrder} = _decorator;

class MessageItem {
	public messageType: MessageType;
	public event: Event;
	public data: any;
	public constructor(type: MessageType, event: Event, data: any) {
		this.messageType = type;
		this.event = event;
		this.data = data;
	}
}
@ccclass('MessageBus')
@executionOrder(-2)
export class MessageBus extends Component {
	private static _instance: MessageBus = null;
	public static get instance(): MessageBus {
		return MessageBus._instance;
	}
	onLoad() {
		if (MessageBus._instance != null) {
			this.node.destroy();
			return;
		}

		MessageBus._instance = this;
		this.init();
		director.addPersistRootNode(this.node);
	}

	protected _messageQueue: Queue<MessageItem> = null;
	protected _dispatcher: EventDispatcher = null;
	protected _callbackMap = {};
	protected isInit = false;
	protected lastProcess = 0;
	readonly limitTimeMs = 16;//0.016s ~ 60FPS
	// protected 
	public init() {
		if (this.isInit) return;
		this._dispatcher = new EventDispatcher();
		this._messageQueue = new Queue<MessageItem>(100);
		this.isInit = true;
	}

	update() {
		if (this.isInit) {
			this.lastProcess = Date.now();
			// log('handing messages...');
			// let count =0;
			while (this._messageQueue.isEmpty == false) {
				if (Date.now() - this.lastProcess < this.limitTimeMs) {
					this.processMessage();
					// log(++count);
				} else {
					// warn("save for next frame");
					break;
				}
			}
		}
	}

	protected processMessage() {
		this.init();
		if (this._messageQueue.isEmpty == false) {
			let item = this._messageQueue.dequeue();
			if (item != null) {
				this._dispatcher.dispatchEvent(item.event, item.data);
			}
		}
	}

	public addEventListener(messageType: MessageType, handler: EventListenerType, bindTarget: Component) {
		this.init();
		if (bindTarget != null) {
			handler = handler.bind(bindTarget);
		} else {
			warn("Can't add event without binder");
			return;
		}

		if (!(messageType in this._callbackMap)) {
			let map = {};
			map[bindTarget._id] = handler;
			this._callbackMap[messageType] = map;
		} else {
			// warn(bindTarget);
			this._callbackMap[messageType][bindTarget._id] = handler;
		}

		this._dispatcher.addEventListener(messageType, handler);
	}


	public removeEventListener(messageType: MessageType, bindTarget: Component) {
		this.init();
		if (bindTarget == null || bindTarget == undefined) {
			warn("Can't remove event without binder");
			return;
		}
		let handler = null;
		if (!(messageType in this._callbackMap)) {
			log('Trying to remove non-existant handler, returning');
			return;
		} else {
			let map = this._callbackMap[messageType];
			if (map != null && bindTarget._id in map) {
				handler = this._callbackMap[messageType][bindTarget._id];
				delete this._callbackMap[messageType][bindTarget._id];
			}
		}

		if (handler != null)
			this._dispatcher.removeEventListener(messageType, handler);
	}

	public clearListeners() {
		this.init();
		this._dispatcher.clearListeners();
	}

	public dispatchMessage(messageType: MessageType, data?: any, forceDispatch = false) {
		this.init();
		if (forceDispatch) {
			this._dispatcher.dispatchEvent(new Event(messageType), data);
		} else {
			this._messageQueue.enqueue(new MessageItem(messageType, new Event(messageType), data));
		}
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
