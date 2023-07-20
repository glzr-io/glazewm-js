import WebSocket from './websocket';

export enum GwmEvent {
  ALL,
  WORKSPACE_FOCUSED,
}

export interface GwmClientOptions {
  port: number;
}

export type SubscribeCommand =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

// TODO: What to name this?
export type InvokeWmCommand =
  | `command "${string}"`
  | `command "${string}" --context-container-id ${string}`
  | `command "${string}" -c ${string}`;

export type GetContainersCommand = 'containers' | 'containers ls';
export type GetMonitorsCommand = 'monitors' | 'monitors ls';
export type GetWorkspacesCommand = 'workspaces' | 'workspaces ls';
export type GetWindowsCommand = 'windows' | 'windows ls';

export type IpcCommand =
  | SubscribeCommand
  | InvokeWmCommand
  | GetContainersCommand
  | GetMonitorsCommand
  | GetWorkspacesCommand
  | GetWindowsCommand;

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private DEFAULT_PORT = 61423;

  /** Socket connection to IPC server. */
  private _socket = new WebSocket(
    `ws://localhost:${this.options?.port ?? this.DEFAULT_PORT}`,
  );

  constructor(private options?: GwmClientOptions) {
    this._registerSocketLifeCycle();
  }

  /** Send an IPC command without waiting for a reply. */
  send(ipcCommand: IpcCommand): void {
    if (this._socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this._socket.send(ipcCommand);
  }

  /** Send an IPC command and wait for a reply. */
  async sendAndAwaitReply<T>(ipcCommand: IpcCommand): Promise<T> {
    this.send(ipcCommand);

    return [] as any as T;
  }

  onEvent(event: GwmEvent[], cb: (event: GwmEvent[]) => void): void;
  onEvent(event: GwmEvent, cb: (event: GwmEvent) => void): void;
  onEvent(
    event: GwmEvent | GwmEvent[],
    cb: (event: GwmEvent | GwmEvent[]) => void,
  ) {
    const joinedEvents = Array.isArray(event) ? event.join(',') : event;
    this.send(`subscribe -e ${joinedEvents}`);
  }

  /** Get all containers (monitors, workspaces, windows, split containers). */
  getContainers() {
    return this.sendAndAwaitReply('containers');
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
  close() {
    this._socket.close();
  }

  private _handleMessage(ev: MessageEvent<unknown>) {}

  private _registerSocketLifeCycle() {
    this._socket.onmessage = (e) => this._handleMessage(e);
    this._socket.onmessage = (e) => this._handleMessage(e);
    this._socket.onmessage = (e) => this._handleMessage(e);
  }
}
