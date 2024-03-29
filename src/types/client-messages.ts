import type { WmCommand } from './wm-commands';

export type SubscribeMessage =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

export type UnsubscribeMessage = `unsubscribe ${string}`;

export type InvokeCommandMessage =
  | `command "${WmCommand}"`
  | `command "${WmCommand}" --context-container-id ${string}`
  | `command "${WmCommand}" -c ${string}`;

export type GetMonitorsMessage = 'monitors';
export type GetWorkspacesMessage = 'workspaces';
export type GetWindowsMessage = 'windows';
export type GetFocusedContainerMessage = 'focused_container';
export type GetBindingModeMessage = 'binding_mode';

export type ClientMessage =
  | SubscribeMessage
  | UnsubscribeMessage
  | InvokeCommandMessage
  | GetMonitorsMessage
  | GetWorkspacesMessage
  | GetWindowsMessage
  | GetFocusedContainerMessage
  | GetBindingModeMessage;
