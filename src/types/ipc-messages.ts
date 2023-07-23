import { WmCommand } from './wm-commands';

export type SubscribeMessage =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

export type InvokeCommandMessage =
  | `command "${WmCommand}"`
  | `command "${WmCommand}" --context-container-id ${string}`
  | `command "${WmCommand}" -c ${string}`;

export type GetContainersMessage = 'containers' | 'containers ls';
export type GetMonitorsMessage = 'monitors' | 'monitors ls';
export type GetWorkspacesMessage = 'workspaces' | 'workspaces ls';
export type GetWindowsMessage = 'windows' | 'windows ls';

export type IpcMessage =
  | SubscribeMessage
  | InvokeCommandMessage
  | GetContainersMessage
  | GetMonitorsMessage
  | GetWorkspacesMessage
  | GetWindowsMessage;
