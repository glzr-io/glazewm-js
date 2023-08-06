import { IpcMessage, GwmEvent, GwmEventData } from './types';
import { ServerMessage } from './types/server-message';
import WebSocket from './websocket';

export interface GwmClientOptions {
  port: number;
}

/** Unregister a callback. */
export type UnlistenFn = () => void;

export type MessageCallback<T = unknown> = (message: ServerMessage<T>) => void;
export type ConnectCallback = (e: Event) => void;
export type DisconnectCallback = (e: CloseEvent) => void;
export type ErrorCallback = (e: Event) => void;
export type SubscribeCallback = (data: GwmEventData) => void;

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private readonly DEFAULT_PORT = 6123;

  /** Socket connection to IPC server. */
  private _socket = new WebSocket(
    `ws://localhost:${this.options?.port ?? this.DEFAULT_PORT}`,
  );

  private _onMessageCallbacks: MessageCallback[] = [];
  private _onConnectCallbacks: ConnectCallback[] = [];
  private _onDisconnectCallbacks: DisconnectCallback[] = [];
  private _onErrorCallbacks: ErrorCallback[] = [];

  /**
   * Instantiates client and begins establishing websocket connection to
   * GlazeWM IPC server.
   */
  constructor(private options?: GwmClientOptions) {
    this._registerSocketLifecycle();
  }

  /** Send an IPC message without waiting for a reply. */
  async send(message: IpcMessage): Promise<void> {
    await this._waitForConnection();
    this._socket.send(message);
  }

  /** Send an IPC message and wait for a reply. */
  async sendAndWaitReply<T>(message: IpcMessage): Promise<ServerMessage<T>> {
    let unlisten: UnlistenFn;

    return new Promise<ServerMessage<T>>(async (resolve) => {
      await this.send(message);

      unlisten = this.onMessage<T>((msg) => {
        // Whether the incoming message is a reply to the client message.
        const isReplyMessage =
          msg.messageType === 'client_response' &&
          msg.clientMessage === message;

        if (isReplyMessage) {
          resolve(msg);
        }
      });
    }).finally(() => unlisten());
  }

  /** Get all monitors. */
  async getMonitors() {
    return (await this.sendAndWaitReply('monitors')).data as any;
  }

  /** Get all workspaces. */
  async getWorkspaces() {
    return (await this.sendAndWaitReply('workspaces')).data as any;
  }

  /** Get all windows. */
  async getWindows() {
    return (await this.sendAndWaitReply('windows')).data as any;
  }

  /** Close the websocket connection. */
  close(): void {
    this._socket.close();
  }

  /** Register a callback for one or more GlazeWM events. */
  async subscribe<T extends GwmEvent | GwmEvent[]>(
    event: T,
    callback: SubscribeCallback,
  ): Promise<UnlistenFn> {
    const eventsArr = Array.isArray(event) ? event : [event];

    const response = await this.sendAndWaitReply(
      `subscribe -e ${eventsArr.join(',')}`,
    );

    if (response.error) {
      throw new Error(
        `Failed to subscribe to event '${eventsArr}': ${response.error}`,
      );
    }

    const unlisten = this.onMessage((msg) => {
      // TODO: Avoid any cast.
      if (
        msg.messageType === 'subscribed_event' &&
        eventsArr.includes((msg.data as any).type)
      ) {
        callback(msg.data as any);
      }
    });

    // TODO: Properly unsubscribe from the event(s).
    return unlisten;
  }

  /**
   * Register a callback for when any websocket messages are received.
   *
   * @example
   * ```typescript
   * const unlisten = client.onDisconnect(e => console.log(e));
   * ```
   **/
  onMessage<T = unknown>(callback: MessageCallback<T>): UnlistenFn {
    return this._registerCallback(this._onMessageCallbacks, callback);
  }

  /**
   * Register a callback for when the websocket connects.
   *
   * @example
   * ```typescript
   * const unlisten = client.onDisconnect(e => console.log(e));
   * ```
   **/
  onConnect(callback: ConnectCallback): UnlistenFn {
    return this._registerCallback(this._onConnectCallbacks, callback);
  }

  /**
   * Register a callback for when the websocket disconnects.
   *
   * @example
   * ```typescript
   * const unlisten = client.onDisconnect(e => console.log(e));
   * ```
   **/
  onDisconnect(callback: DisconnectCallback): UnlistenFn {
    return this._registerCallback(this._onDisconnectCallbacks, callback);
  }

  /**
   * Register a callback for when the websocket connection errors.
   *
   * @example
   * ```typescript
   * const unlisten = client.onError(e => console.error(e));
   * ```
   **/
  onError(callback: ErrorCallback): UnlistenFn {
    return this._registerCallback(this._onErrorCallbacks, callback);
  }

  async _waitForConnection(): Promise<void> {
    if (this._socket.readyState === WebSocket.OPEN) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.onConnect(() => resolve());
    });
  }

  private _registerCallback<T>(callbacks: T[], newCallback: T): UnlistenFn {
    callbacks.push(newCallback);

    // Return a function to unregister the callback.
    return () => {
      for (const [index, callback] of callbacks.entries()) {
        if (callback === newCallback) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private _registerSocketLifecycle(): void {
    this._socket.onmessage = (e) =>
      this._onMessageCallbacks.forEach((callback) =>
        callback(JSON.parse(e.data)),
      );

    this._socket.onopen = (e) =>
      this._onConnectCallbacks.forEach((callback) => callback(e));

    this._socket.onerror = (e) =>
      this._onErrorCallbacks.forEach((callback) => callback(e));

    this._socket.onclose = (e) =>
      this._onDisconnectCallbacks.forEach((callback) => callback(e));
  }
}
