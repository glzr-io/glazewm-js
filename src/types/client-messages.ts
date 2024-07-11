import type { WmCommand } from './wm-commands';

type AppMetadataCommand = 'app-metadata'
type BindingModesCommand = 'binding-modes'
type FocusedCommand = 'focused'
type MonitorsCommand = 'monitors'
type WindowsCommand = 'windows'
type WorkspacesCommand = 'workspaces'

export type QueryCommand = AppMetadataCommand | BindingModesCommand | FocusedCommand | MonitorsCommand | WindowsCommand | WorkspacesCommand

export type QueryMessage = `query ${QueryCommand}` | `q ${QueryCommand}`;

export type SubscribeMessage =
  | 'subscribe'
  | `subscribe --events ${string}`
  | `subscribe -e ${string}`;

export type UnsubscribeMessage = `unsubscribe ${string}`;

export type InvokeCommandMessage =
  | `command ${WmCommand}`
  //| `command "${WmCommand}"`
  | `command ${WmCommand} ${string}`
  | `command "${WmCommand}"  ${string}`
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
  | QueryMessage
  | GetMonitorsMessage
  | GetWorkspacesMessage
  | GetWindowsMessage
  | GetFocusedContainerMessage
  | GetBindingModeMessage;
