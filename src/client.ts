import { IpcMessage, GwmEvent, GwmEventPayload } from './types';
import { ServerMessage } from './types/server-message';
import WebSocket from './websocket';

export interface GwmClientOptions {
  port: number;
}

export type OnConnectCallback = (e: Event) => void;
export type OnDisconnectCallback = (e: CloseEvent) => void;
export type OnErrorCallback = (e: Event) => void;
export type OnEventCallback = (payload: GwmEventPayload) => void;
export type UnlistenFn = () => void;

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private readonly DEFAULT_PORT = 6123;

  /** Socket connection to IPC server. */
  private _socket = new WebSocket(
    `ws://localhost:${this.options?.port ?? this.DEFAULT_PORT}`,
  );

  private _onConnectCallbacks: OnConnectCallback[] = [];
  private _onDisconnectCallbacks: OnDisconnectCallback[] = [];
  private _onErrorCallbacks: OnErrorCallback[] = [];

  private _messageCallbackMap = new Map<IpcMessage, OnEventCallback[]>();
  private _eventCallbackMap = new Map<GwmEvent, OnEventCallback[]>();

  constructor(private options?: GwmClientOptions) {
    this._registerSocketLifecycle();
  }

  /** Send an IPC message without waiting for a reply. */
  send(message: IpcMessage): void {
    this._socket.send(message);
  }

  /** Send an IPC message and wait for a reply. */
  async sendAndAwaitReply<T>(message: IpcMessage): Promise<ServerMessage<T>> {
    this.send(message);

    if (!this._messageCallbackMap.has(message)) {
      this._messageCallbackMap.set(message, [callback]);
    }

    const existingCallbacks = this._messageCallbackMap.get(message)!;
    this._messageCallbackMap.set(message, [...existingCallbacks, callback]);

    return [] as any as T;
  }

  /** Get all monitors. */
  getMonitors() {
    return this.sendAndAwaitReply('monitors');
  }

  /** Get all workspaces. */
  getWorkspaces() {
    return this.sendAndAwaitReply('workspaces');
  }

  /** Get all windows. */
  getWindows() {
    return this.sendAndAwaitReply('windows');
  }

  /** Close the websocket connection. */
  close(): void {
    this._socket.close();
  }

  /** Register a callback for one or more GlazeWM events. */
  async subscribe<T extends GwmEvent | GwmEvent[]>(
    event: T,
    callback: OnEventCallback,
  ): Promise<void> {
    const eventsArr = Array.isArray(event) ? event : [event];

    const response = await this.sendAndAwaitReply(
      `subscribe -e ${eventsArr.join(',')}`,
    );

    if (response.error) {
      throw new Error(
        `Failed to subscribe to event '${eventsArr}': ${response.error}`,
      );
    }

    // TODO: Return a function that unsubscribes from the event(s).

    for (const event of eventsArr) {
      if (!this._eventCallbackMap.has(event)) {
        this._eventCallbackMap.set(event, [callback]);
      }

      const existingCallbacks = this._eventCallbackMap.get(event)!;
      this._eventCallbackMap.set(event, [...existingCallbacks, callback]);
    }
  }

  /** Register a callback for when the websocket connects. */
  onConnect(callback: OnConnectCallback): UnlistenFn {
    this._onConnectCallbacks.push(callback);

    return () => {
      this._onConnectCallbacks = this._onConnectCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  /** Register a callback for when the websocket disconnects. */
  onDisconnect(callback: OnDisconnectCallback): UnlistenFn {
    this._onDisconnectCallbacks.push(callback);

    return () => {
      this._onDisconnectCallbacks = this._onDisconnectCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  /** Register a callback for when the websocket connection errors. */
  onError(callback: OnErrorCallback): UnlistenFn {
    this._onErrorCallbacks.push(callback);

    return () => {
      this._onErrorCallbacks = this._onErrorCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  /** Handler for all messages received from IPC server. */
  private _handleMessage(e: MessageEvent<ServerMessage<unknown>>): void {
    const { data: serverMessage } = e;

    if (serverMessage.messageType === 'subscribed_event') {
      const eventCallbacks = this._eventCallbackMap.get(data.type);
      eventCallbacks?.forEach((cb) => cb(data));
    }
  }

  /** Register callbacks for socket lifecycle methods. */
  private _registerSocketLifecycle(): void {
    this._socket.onmessage = (e) => this._handleMessage(e);

    this._socket.onopen = (e) =>
      this._onConnectCallbacks.forEach((callback) => callback(e));

    this._socket.onerror = (e) =>
      this._onErrorCallbacks.forEach((callback) => callback(e));

    this._socket.onclose = (e) =>
      this._onDisconnectCallbacks.forEach((callback) => callback(e));
  }
}
