import { WmCommand } from './wm-commands';

export type SubscribeCommand =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

export type InvokeWmCommand =
  | `command "${WmCommand}"`
  | `command "${WmCommand}" --context-container-id ${string}`
  | `command "${WmCommand}" -c ${string}`;

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
