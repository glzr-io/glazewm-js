import {
  WebSocket,
  type MessageEvent,
  type Event,
  type CloseEvent,
  type ErrorEvent,
} from 'ws';

import {
  type BindingModeConfig,
  WmEventType,
  type WmEventData,
  type Monitor,
  type ServerMessage,
  type Workspace,
  type EventSubscription,
  type Window,
} from './types';

export interface WmClientOptions {
  /** IPC server port to connect to. Defaults to `6123`.  */
  port?: number;
}

/** Unregisters a callback. */
export type UnlistenFn = () => void;

export type MessageCallback = (e: MessageEvent) => void;
export type ConnectCallback = (e: Event) => void;
export type DisconnectCallback = (e: CloseEvent) => void;
export type ErrorCallback = (e: ErrorEvent) => void;
export type SubscribeCallback<T extends WmEventType> = (
  data: WmEventData<T>,
) => void;

export class WmClient {
  private readonly DEFAULT_PORT = 6123;

  /** Websocket connection to IPC server. */
  private _socket: WebSocket | null = null;

  /** Promise used to prevent duplicate connections. */
  private _createSocketPromise: Promise<WebSocket> | null = null;

  private _onMessageCallbacks: MessageCallback[] = [];
  private _onConnectCallbacks: ConnectCallback[] = [];
  private _onDisconnectCallbacks: DisconnectCallback[] = [];
  private _onErrorCallbacks: ErrorCallback[] = [];

  /**
   * Instantiates client.
   *
   * Connection to the IPC server is established when sending the first
   * message or by explicitly calling {@link connect}.
   */
  constructor(private _options?: WmClientOptions) {}

  /**
   * Gets all monitors. {@link Monitor}
   */
  async queryMonitors(): Promise<{ monitors: Monitor[] }> {
    return this._sendAndWaitReply<{ monitors: Monitor[] }>(
      'query monitors',
    );
  }

  /**
   * Gets all active workspaces. {@link Workspace}
   */
  async queryWorkspaces(): Promise<{ workspaces: Workspace[] }> {
    return this._sendAndWaitReply<{ workspaces: Workspace[] }>(
      'query workspaces',
    );
  }

  /**
   * Gets all managed windows. {@link Window}
   */
  async queryWindows(): Promise<{ windows: Window[] }> {
    return this._sendAndWaitReply<{ windows: Window[] }>('query windows');
  }

  /**
   * Gets the currently focused container. This can either be a
   * {@link Window} or a {@link Workspace} without any descendant windows.
   */
  async queryFocusedContainer(): Promise<{ focused: Window | Workspace }> {
    return this._sendAndWaitReply<{ focused: Window | Workspace }>(
      'query focused',
    );
  }

  /**
   * Gets the active binding modes. {@link BindingModeConfig}
   */
  async queryBindingModes(): Promise<{
    bindingModes: BindingModeConfig[];
  }> {
    return this._sendAndWaitReply<{ bindingModes: BindingModeConfig[] }>(
      'query binding-modes',
    );
  }

  /**
   * Invokes a WM command (e.g. `"focus --workspace 1"`).
   *
   * @param command WM command to run (e.g. `"focus --workspace 1"`).
   * @param subjectContainerId (optional) ID of container to use as subject.
   * If not provided, this defaults to the currently focused container.
   * @throws If command fails.
   */
  async runCommand(
    command: string,
    subjectContainerId?: string,
  ): Promise<void> {
    await this._sendAndWaitReply<{ subjectContainerId: string }>(
      subjectContainerId
        ? `command "${command}" -c ${subjectContainerId}`
        : `command ${command}`,
    );
  }

  /**
   * Establishes websocket connection.
   *
   * @throws If connection attempt fails.
   */
  async connect(): Promise<void> {
    if (!this._socket) {
      const socketPromise =
        this._createSocketPromise ??
        (this._createSocketPromise = this._createSocket());

      this._socket = await socketPromise;
    }

    await this._waitForConnection();
  }

  /**
   * Closes the websocket connection.
   */
  closeConnection(): void {
    this._socket?.close();
  }

  /**
   * Registers a callback for a GlazeWM event type.
   *
   * @example
   * ```typescript
   * const unlisten = await client.subscribe(
   *   WmEventType.FOCUS_CHANGED,
   *   (event: FocusChangedEvent) => { ... }
   * });
   * ```
   */
  async subscribe<T extends WmEventType>(
    event: T,
    callback: SubscribeCallback<T>,
  ): Promise<UnlistenFn> {
    return this.subscribeMany([event], callback);
  }

  /**
   * Registers a callback for multiple GlazeWM event types.
   *
   * @example
   * ```typescript
   * const unlisten = await client.subscribeMany(
   *   [WmEventType.WORSPACE_ACTIVATED, WmEventType.WORSPACE_DEACTIVATED],
   *   (event: WorkspaceActivatedEvent | WorkspaceDeactivatedEvent) => { ... }
   * );
   * ```
   */
  async subscribeMany<T extends WmEventType[]>(
    events: T,
    callback: SubscribeCallback<T[number]>,
  ): Promise<UnlistenFn> {
    const response = await this._sendAndWaitReply<EventSubscription>(
      `subscribe -e ${events.join(',')}`,
    );

    const unlisten = this.onMessage(e => {
      const serverMessage: ServerMessage<WmEventData> = JSON.parse(
        e.data as string,
      );

      const isSubscribedEvent =
        serverMessage.messageType === 'event_subscription' &&
        events.includes(serverMessage.data?.type!);

      if (isSubscribedEvent) {
        callback(serverMessage.data as WmEventData<T[number]>);
      }
    });

    return async () => {
      unlisten();

      await this._sendAndWaitReply<EventSubscription>(
        `unsubscribe ${response.subscriptionId}`,
      );
    };
  }

  /**
   * Registers a callback for when websocket messages are received.
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
   * Registers a callback for when the websocket connects.
   *
   * @example
   * ```typescript
   * const unlisten = client.onDisconnect(e => console.log(e));
   * ```
   */
  onConnect(callback: ConnectCallback): UnlistenFn {
    return this._registerCallback(this._onConnectCallbacks, callback);
  }

  /**
   * Registers a callback for when the websocket disconnects.
   *
   * @example
   * ```typescript
   * const unlisten = client.onDisconnect(e => console.log(e));
   * ```
   */
  onDisconnect(callback: DisconnectCallback): UnlistenFn {
    return this._registerCallback(this._onDisconnectCallbacks, callback);
  }

  /**
   * Registers a callback for when the websocket connection has been closed
   * due to an error.
   *
   * @example
   * ```typescript
   * const unlisten = client.onError(e => console.error(e));
   * ```
   */
  onError(callback: ErrorCallback): UnlistenFn {
    return this._registerCallback(this._onErrorCallbacks, callback);
  }

  /**
   * Sends an IPC message and waits for a reply.
   *
   * @private
   * @throws If message is invalid or IPC server is unable to handle the
   * message.
   */
  private async _sendAndWaitReply<T>(message: string): Promise<T> {
    let unlisten: UnlistenFn;

    // Resolve when a reply comes in for the client message.
    return new Promise<T>(async (resolve, reject) => {
      await this.connect();
      this._socket!.send(message);

      unlisten = this.onMessage(e => {
        const serverMessage: ServerMessage<T> = JSON.parse(
          e.data as string,
        );

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

  /**
   * Utility function for registering a callback.
   *
   * @private
   */
  private _registerCallback<T>(
    callbacks: T[],
    newCallback: T,
  ): UnlistenFn {
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

  /**
   * Instantiates `WebSocket` and adds event listeners for socket events.
   *
   * @private
   */
  private async _createSocket(): Promise<WebSocket> {
    // Get instance of `WebSocket` to use. Uses the `WebSocket` web API
    // when running in the browser, otherwise uses `ws` when running Node.
    const WebSocketApi = await (globalThis.WebSocket ??
      import('ws')
        .then(ws => ws.default)
        .catch(() => {
          throw new Error(
            "The dependency 'ws' is required for environments without a" +
              'built-in WebSocket API. \nRun `npm i ws` to resolve this' +
              'error.',
          );
        }));

    const socket = new WebSocketApi(
      `ws://localhost:${this._options?.port ?? this.DEFAULT_PORT}`,
    );

    socket.onmessage = e =>
      this._onMessageCallbacks.forEach(callback => callback(e));

    socket.onopen = e =>
      this._onConnectCallbacks.forEach(callback => callback(e));

    socket.onerror = e =>
      this._onErrorCallbacks.forEach(callback => callback(e));

    socket.onclose = e =>
      this._onDisconnectCallbacks.forEach(callback => callback(e));

    return socket;
  }

  /**
   * Waits for the websocket connection to be established.
   *
   * @private
   */
  async _waitForConnection(): Promise<WebSocket> {
    if (this._socket && this._socket.readyState === this._socket.OPEN) {
      return this._socket;
    }

    let unlisten: UnlistenFn;

    return new Promise<WebSocket>(async resolve => {
      unlisten = this.onConnect(() => resolve(this._socket!));
    }).finally(() => unlisten());
  }
}
