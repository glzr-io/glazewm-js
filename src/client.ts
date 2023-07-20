import { IpcCommand, GwmEvent } from './types';
import WebSocket from './websocket';

export interface GwmClientOptions {
  port: number;
}

export class GwmClient {
  /** Default port used by GlazeWM for IPC server. */
  private DEFAULT_PORT = 61423;

  /** Socket connection to IPC server. */
  private _socket = new WebSocket(
    `ws://localhost:${this.options?.port ?? this.DEFAULT_PORT}`,
  );

  constructor(private options?: GwmClientOptions) {
    this._registerSocketLifecycle();
  }

  /** Send an IPC command without waiting for a reply. */
  send(ipcCommand: IpcCommand): void {
    this._socket.send(ipcCommand);
  }

  /** Send an IPC command and wait for a reply. */
  async sendAndAwaitReply<T>(ipcCommand: IpcCommand): Promise<T> {
    this.send(ipcCommand);

    return [] as any as T;
  }

  onEvent<T extends GwmEvent | GwmEvent[]>(event: T, cb: (event: T) => void) {
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

  private _registerSocketLifecycle() {
    this._socket.onmessage = (e) => this._handleMessage(e);
    this._socket.onmessage = (e) => this._handleMessage(e);
    this._socket.onmessage = (e) => this._handleMessage(e);
  }
}
