import {
  WebSocket,
  type MessageEvent,
  type Event,
  type CloseEvent,
  type ErrorEvent,
} from 'ws';

import {
  WmEventType,
  type WmEventData,
  type Monitor,
  type ServerMessage,
  type Workspace,
  type Window,
  type AppMetadataResponse,
  type TilingDirectionResponse,
  type BindingModesResponse,
  type FocusedResponse,
  type WindowsResponse,
  type MonitorsResponse,
  type PausedResponse,
  type WorkspacesResponse,
  type RunCommandResponse,
  type SubscribeResponse,
} from './types';

export interface WmClientOptions {
  /**
   * IPC server port to connect to.
   *
   * Defaults to `6123`.
   */
  port?: number;

  /**
   * Reconnection interval in milliseconds.
   *
   * Defaults to `5000` (5 seconds).
   */
  reconnectInterval?: number;
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
  private readonly DEFAULT_RECONNECT_INTERVAL = 5000;

  /**
   * Promise that resolves to `WebSocket` instance if connected.
   *
   * Prevents duplicate connections.
   */
  private _socketPromise: Promise<WebSocket> | null = null;

  /**
   * Whether the connection was closed via {@link closeConnection}.
   */
  private _isManuallyClosed = false;

  private _onMessageCallbacks: MessageCallback[] = [];
  private _onConnectCallbacks: ConnectCallback[] = [];
  private _onDisconnectCallbacks: DisconnectCallback[] = [];
  private _onErrorCallbacks: ErrorCallback[] = [];

  /**
   * Instantiates client and attempts to connect to IPC server.
   *
   * The client will automatically attempt to reconnect on disconnections,
   * configurable via {@link WmClientOptions.reconnectInterval}.
   */
  constructor(private _options?: WmClientOptions) {
    this.connect().catch(() => {});
  }

  /**
   * Gets all monitors. {@link Monitor}
   *
   * @throws If connection to IPC server fails.
   */
  async queryMonitors(): Promise<MonitorsResponse> {
    return this._sendAndWaitReply<MonitorsResponse>('query monitors');
  }

  /**
   * Gets all active workspaces. {@link Workspace}
   *
   * @throws If connection to IPC server fails.
   */
  async queryWorkspaces(): Promise<WorkspacesResponse> {
    return this._sendAndWaitReply<WorkspacesResponse>('query workspaces');
  }

  /**
   * Gets all managed windows. {@link Window}
   *
   * @throws If connection to IPC server fails.
   */
  async queryWindows(): Promise<WindowsResponse> {
    return this._sendAndWaitReply<WindowsResponse>('query windows');
  }

  /**
   * Gets the currently focused container. This can either be a
   * {@link Window} or a {@link Workspace} without any descendant windows.
   *
   * @throws If connection to IPC server fails.
   */
  async queryFocused(): Promise<FocusedResponse> {
    return this._sendAndWaitReply<FocusedResponse>('query focused');
  }

  /**
   * Gets the active binding modes.
   *
   * @throws If connection to IPC server fails.
   */
  async queryBindingModes(): Promise<BindingModesResponse> {
    return this._sendAndWaitReply<BindingModesResponse>(
      'query binding-modes',
    );
  }

  /**
   * Gets metadata about the running GlazeWM application.
   *
   * @throws If connection to IPC server fails.
   */
  async queryAppMetadata(): Promise<AppMetadataResponse> {
    return this._sendAndWaitReply<AppMetadataResponse>(
      'query app-metadata',
    );
  }

  /**
   * Gets the tiling direction of the focused container.
   *
   * @throws If connection to IPC server fails.
   */
  async queryTilingDirection(): Promise<TilingDirectionResponse> {
    return this._sendAndWaitReply<TilingDirectionResponse>(
      'query tiling-direction',
    );
  }

  /**
   * Gets the current paused state.
   *
   * @throws If connection to IPC server fails.
   */
  async queryPaused(): Promise<PausedResponse> {
    return this._sendAndWaitReply<PausedResponse>('query paused');
  }

  /**
   * Invokes a WM command (e.g. `"focus --workspace 1"`).
   *
   * @param command WM command to run (e.g. `"focus --workspace 1"`).
   * @param subjectContainerId (optional) ID of container to use as subject.
   * If not provided, this defaults to the currently focused container.
   * @throws If the command errors or connection to IPC server fails.
   */
  async runCommand(
    command: string,
    subjectContainerId?: string,
  ): Promise<RunCommandResponse> {
    return this._sendAndWaitReply<RunCommandResponse>(
      subjectContainerId
        ? `command --id ${subjectContainerId} ${command}`
        : `command ${command}`,
    );
  }

  /**
   * Establishes websocket connection.
   *
   * @throws If connection to IPC server fails.
   */
  async connect(): Promise<void> {
    this._isManuallyClosed = false;
    this._socketPromise ??= this._createSocket();
    await this._waitForConnection();
  }

  /**
   * Closes the websocket connection.
   */
  async closeConnection(): Promise<void> {
    this._isManuallyClosed = true;
    (await this._socketPromise)?.close();
  }

  /**
   * Registers a callback for a GlazeWM event type.
   *
   * Persists the subscription across reconnections.
   *
   * @example
   * ```typescript
   * const unlisten = await client.subscribe(
   *   WmEventType.FOCUS_CHANGED,
   *   (event: FocusChangedEvent) => { ... }
   * });
   * ```
   * @throws If *initial* connection to IPC server fails.
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
   * Persists the subscription across reconnections.
   *
   * @example
   * ```typescript
   * const unlisten = await client.subscribeMany(
   *   [WmEventType.WORSPACE_ACTIVATED, WmEventType.WORSPACE_DEACTIVATED],
   *   (event: WorkspaceActivatedEvent | WorkspaceDeactivatedEvent) => { ... }
   * );
   * ```
   * @throws If *initial* connection to IPC server fails.
   */
  async subscribeMany<T extends WmEventType[]>(
    events: T,
    callback: SubscribeCallback<T[number]>,
  ): Promise<UnlistenFn> {
    let subscriptionId = await this._sendSubscribe(events);

    const unlistenMessage = this.onMessage(e => {
      const serverMessage: ServerMessage<WmEventData> = JSON.parse(
        e.data as string,
      );

      const isSubscribedEvent =
        serverMessage.messageType === 'event_subscription' &&
        serverMessage.subscriptionId === subscriptionId;

      if (isSubscribedEvent) {
        callback(serverMessage.data as WmEventData<T[number]>);
      }
    });

    const unlistenConnect = this.onConnect(async e => {
      this._sendUnsubscribe(subscriptionId);
      subscriptionId = await this._sendSubscribe(events);
    });

    return async () => {
      unlistenMessage();
      unlistenConnect();
      await this._sendUnsubscribe(subscriptionId);
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
   * Registers a callback for when the websocket connects or reconnects.
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
   * @throws If message is invalid or connection to IPC server fails.
   */
  private async _sendAndWaitReply<T>(message: string): Promise<T> {
    if (this._isManuallyClosed) {
      throw new Error(
        'Websocket connection was closed via `closeConnection`.',
      );
    }

    await this.connect();
    const socket = await this._socketPromise!;

    // Resolve when a reply comes in for the client message.
    return new Promise<T>(async (resolve, reject) => {
      socket.send(message, error => {
        if (error) {
          reject(error);
        }
      });

      const unlisten = this.onMessage(e => {
        const serverMessage: ServerMessage<T> = JSON.parse(
          e.data as string,
        );

        // Whether the incoming message is a reply to the client message.
        const isReplyMessage =
          serverMessage.messageType === 'client_response' &&
          serverMessage.clientMessage === message;

        if (isReplyMessage) {
          unlisten();

          if (serverMessage.error) {
            reject(serverMessage.error);
          } else {
            resolve(serverMessage.data as T);
          }
        }
      });
    });
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

    socket.onclose = e => {
      this._onDisconnectCallbacks.forEach(callback => callback(e));

      // Attempt to reconnect if not manually closed.
      if (!this._isManuallyClosed) {
        setTimeout(
          () => (this._socketPromise = this._createSocket()),
          this._options?.reconnectInterval ??
            this.DEFAULT_RECONNECT_INTERVAL,
        );
      }
    };

    return socket;
  }

  /**
   * Waits for the websocket connection to be established.
   *
   * @private
   * @throws On disconnect or close.
   */
  private async _waitForConnection(): Promise<WebSocket> {
    const socket = await this._socketPromise;

    if (
      !socket ||
      socket.readyState === socket.CLOSED ||
      socket.readyState === socket.CLOSING
    ) {
      throw new Error('Websocket connection is closed.');
    }

    if (socket.readyState === socket.OPEN) {
      return socket;
    }

    return new Promise<WebSocket>(async (resolve, reject) => {
      function cleanup() {
        if (unlistenConnect) unlistenConnect();
        if (unlistenDisconnect) unlistenDisconnect();
      }

      const unlistenConnect = this.onConnect(() => {
        cleanup();
        resolve(socket);
      });

      const unlistenDisconnect = this.onDisconnect(() => {
        cleanup();
        reject(new Error('Failed to establish websocket connection.'));
      });
    });
  }

  /**
   * @private
   * @throws If connection to IPC server fails.
   */
  private async _sendSubscribe(events: WmEventType[]): Promise<string> {
    const { subscriptionId } =
      await this._sendAndWaitReply<SubscribeResponse>(
        `sub --events ${events.join(' ')}`,
      );

    return subscriptionId;
  }

  /**
   * @private
   * @throws If connection to IPC server fails.
   */
  private async _sendUnsubscribe(subscriptionId: string): Promise<void> {
    await this._sendAndWaitReply<void>(`unsub --id ${subscriptionId}`);
  }
}
