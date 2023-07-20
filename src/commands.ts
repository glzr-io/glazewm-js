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
