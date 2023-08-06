import {
  Direction,
  ResizeDimension,
  TilingDirection,
  WindowState,
} from './shared';

export type FocusInDirectionCommand = `focus ${Direction}`;
export type FocusWorkspaceCommand = `focus workspace ${string}`;

export type MoveWindowCommand = `move ${Direction}`;
export type MoveWindowToWorkspaceCommand = `move to workspace ${string}`;

export type SetWindowSizeCommand = `set ${ResizeDimension} ${string}`;
export type ResizeWindowCommand = `resize ${ResizeDimension} ${string}`;
export type ResizeWindowBordersCommand = `resize borders ${string}`;

export type SetWindowStateCommand = `set ${WindowState}`;
export type ToggleWindowStateCommand = `toggle ${Exclude<
  WindowState,
  'minimized' | 'maximized'
>}`;

export type ChangeFocusModeCommand = 'focus mode toggle';
export type ChangeTilingDirectionCommand = `tiling direction ${
  | TilingDirection
  | 'toggle'}`;

export type ExitWmCommand = 'exit wm';
export type ReloadConfigCommand = 'reload config';
export type CloseWindowCommand = 'close';
export type ExecProcessCommand = `exec ${string}`;
export type IgnoreCommand = 'ignore';

export type WmCommand =
  | FocusInDirectionCommand
  | FocusWorkspaceCommand
  | MoveWindowCommand
  | MoveWindowToWorkspaceCommand
  | SetWindowSizeCommand
  | ResizeWindowCommand
  | ResizeWindowBordersCommand
  | SetWindowStateCommand
  | ToggleWindowStateCommand
  | ChangeFocusModeCommand
  | ChangeTilingDirectionCommand
  | ExitWmCommand
  | ReloadConfigCommand
  | CloseWindowCommand
  | ExecProcessCommand
  | IgnoreCommand;
