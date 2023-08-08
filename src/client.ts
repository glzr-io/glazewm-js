import {
  ClientMessage,
  GwmEvent,
  GwmEventData,
  Monitor,
  ServerMessage,
  Workspace,
} from './types';
import WebSocket from './websocket';

export interface GwmClientOptions {
  port: number;
}

/** Unregister a callback. */
export type UnlistenFn = () => void;

export type MessageCallback = (e: MessageEvent<string>) => void;
export type ConnectCallback = (e: Event) => void;
export type DisconnectCallback = (e: CloseEvent) => void;
export type ErrorCallback = (e: Event) => void;
export type SubscribeCallback = (data: GwmEventData) => void;

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private readonly DEFAULT_PORT = 6123;

  /** Socket connection to IPC server. */
  private _socket = this._createSocket();

  private _onMessageCallbacks: MessageCallback[] = [];
  private _onConnectCallbacks: ConnectCallback[] = [];
  private _onDisconnectCallbacks: DisconnectCallback[] = [];
  private _onErrorCallbacks: ErrorCallback[] = [];

  /**
   * Instantiates client and begins establishing websocket connection to
   * GlazeWM IPC server.
   */
  constructor(private _options?: GwmClientOptions) {}

  /**
   * Send an IPC message and wait for a reply.
   */
  async sendAndWaitReply<T>(message: ClientMessage): Promise<T> {
    let unlisten: UnlistenFn;

    // Resolve when a reply comes in for the client message.
    return new Promise<T>(async (resolve, reject) => {
      await this._waitForConnection();
      this._socket.send(message);

      unlisten = this.onMessage((e) => {
        const serverMessage: ServerMessage<T> = JSON.parse(e.data);

        // Whether the incoming message is a reply to the client message.
        const isReplyMessage =
          serverMessage.messageType === 'client_response' &&
          serverMessage.clientMessage === message;

        if (isReplyMessage && serverMessage.error) {
          reject(
            `Server reply to message '${message}' has error: ${serverMessage.error}`,
          );
        }

        if (isReplyMessage) {
          resolve(serverMessage.data as T);
        }
      });
    }).finally(() => unlisten());
  }

  /** Get all monitors. */
  async getMonitors(): Promise<Monitor[]> {
    return (await this.sendAndWaitReply('monitors')).data as any;
  }

  /** Get all workspaces. */
  async getWorkspaces(): Promise<Workspace[]> {
    return (await this.sendAndWaitReply('workspaces')).data as any;
  }

  /** Get all windows. */
  async getWindows(): Promise<Window[]> {
    return (await this.sendAndWaitReply('windows')).data as any;
  }

  /** Close the websocket connection. */
  close(): void {
    this._socket.close();
  }

  /** Re-establish websocket connection if no longer connected. */
  reconnect(): void {
    // Check whether already connected.
    if (this._socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.close();
    this._socket = this._createSocket();
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
   */
  onMessage(callback: MessageCallback): UnlistenFn {
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

    let unlisten: UnlistenFn;

    return new Promise<void>((resolve) => {
      unlisten = this.onConnect(() => resolve());
    }).finally(() => unlisten());
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

  private _createSocket(): WebSocket {
    const socket = new WebSocket(
      `ws://localhost:${this._options?.port ?? this.DEFAULT_PORT}`,
    );

    socket.onmessage = (e) =>
      this._onMessageCallbacks.forEach((callback) => callback(e));

    socket.onopen = (e) =>
      this._onConnectCallbacks.forEach((callback) => callback(e));

    socket.onerror = (e) =>
      this._onErrorCallbacks.forEach((callback) => callback(e));

    socket.onclose = (e) =>
      this._onDisconnectCallbacks.forEach((callback) => callback(e));

    return socket;
  }
}
