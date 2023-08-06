import { GwmCommand } from './gwm-commands';

export type SubscribeMessage =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

export type InvokeCommandMessage =
  | `command "${GwmCommand}"`
  | `command "${GwmCommand}" --context-container-id ${string}`
  | `command "${GwmCommand}" -c ${string}`;

export type GetMonitorsMessage = 'monitors';
export type GetWorkspacesMessage = 'workspaces';
export type GetWindowsMessage = 'windows';

export type ClientMessage =
  | SubscribeMessage
  | InvokeCommandMessage
  | GetMonitorsMessage
  | GetWorkspacesMessage
  | GetWindowsMessage;
