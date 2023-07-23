import { IpcMessage, GwmEvent, GwmEventPayload } from './types';
import WebSocket from './websocket';

export interface GwmClientOptions {
  port: number;
}

export type OnConnectCallback = (e: Event) => void;
export type OnDisconnectCallback = (e: CloseEvent) => void;
export type OnErrorCallback = (e: Event) => void;
export type OnEventCallback = (payload: GwmEventPayload) => void;

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private readonly DEFAULT_PORT = 61423;

  /** Socket connection to IPC server. */
  private _socket = new WebSocket(
    `ws://localhost:${this.options?.port ?? this.DEFAULT_PORT}`,
  );

  private _onConnectCallbacks: OnConnectCallback[] = [];
  private _onDisconnectCallbacks: OnDisconnectCallback[] = [];
  private _onErrorCallbacks: OnErrorCallback[] = [];

  private _eventCallbackMap = new Map<GwmEvent, OnEventCallback[]>();

  constructor(private options?: GwmClientOptions) {
    this._registerSocketLifecycle();
  }

  /** Send an IPC message without waiting for a reply. */
  send(message: IpcMessage): void {
    this._socket.send(message);
  }

  /** Send an IPC message and wait for a reply. */
  async sendAndAwaitReply<T>(message: IpcMessage): Promise<T> {
    this.send(message);

    return [] as any as T;
  }

  onEvent<T extends GwmEvent | GwmEvent[]>(
    event: T,
    callback: OnEventCallback,
  ): void {
    const eventsArr = Array.isArray(event) ? event : [event];

    this.send(`subscribe -e ${eventsArr.join(',')}`);

    for (const event of eventsArr) {
      if (!this._eventCallbackMap.has(event)) {
        this._eventCallbackMap.set(event, [callback]);
      }

      const existingCallbacks = this._eventCallbackMap.get(event)!;
      this._eventCallbackMap.set(event, [...existingCallbacks, callback]);
    }
  }

  onConnect(callback: OnConnectCallback) {
    this._onConnectCallbacks.push(callback);

    return () => {
      this._onConnectCallbacks = this._onConnectCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  onDisconnect(callback: OnDisconnectCallback) {
    this._onDisconnectCallbacks.push(callback);

    return () => {
      this._onDisconnectCallbacks = this._onDisconnectCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  onError(callback: OnErrorCallback) {
    this._onErrorCallbacks.push(callback);

    return () => {
      this._onErrorCallbacks = this._onErrorCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  /** Get all containers (monitors, workspaces, windows, split containers). */
  getContainers() {
    return this.sendAndAwaitReply('containers ls');
  }

  /** Get all monitors. */
  getMonitors() {
    return this.sendAndAwaitReply('monitors ls');
  }

  /** Get all workspaces. */
  getWorkspaces() {
    return this.sendAndAwaitReply('workspaces ls');
  }

  /** Get all windows. */
  getWindows() {
    return this.sendAndAwaitReply('windows ls');
  }

  /** Close the websocket connection. */
  close(): void {
    this._socket.close();
  }

  /** Handler for all messages received from IPC server. */
  private _handleMessage(e: MessageEvent<unknown>): void {
    const { payloadType, data } = e.data as any; // TODO

    if (payloadType === 'event') {
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
