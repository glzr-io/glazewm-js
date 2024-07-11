import {
  Direction,
  ResizeDimension,
  TilingDirection,
  WindowState,
} from './shared';

export type FocusInDirectionCommand = `focus --direction ${Direction}`;
export type FocusWorkspaceCommand = `focus --workspace ${string}`;
export type FocusNextWorkspaceCommand = 'focus --next-workspace';
export type FocusPrevWorkspaceCommand = 'focus --prev-workspace';
export type FocusRecentWorkspaceCommand = 'focus --recent-workspace';

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

type AdjustBorderDirection = 'top' | 'right' | 'bottom' | 'left';
type AdjustBorderDirectionFlag = `--${AdjustBorderDirection} ${string}`;
export type AdjustBordersCommand = `adjust-borders${'' | ` ${AdjustBorderDirectionFlag}` | ` ${AdjustBorderDirectionFlag}` | ` ${AdjustBorderDirectionFlag}` | ` ${AdjustBorderDirectionFlag}`}` | `adjust-borders ${string}`;


export type WmCommand =
  | FocusInDirectionCommand
  | FocusWorkspaceCommand
  | FocusNextWorkspaceCommand
  | FocusPrevWorkspaceCommand
  | FocusRecentWorkspaceCommand
  | MoveWindowCommand
  | MoveWindowToWorkspaceCommand
  | SetWindowSizeCommand
  | ResizeWindowCommand
  | ResizeWindowBordersCommand
  | SetWindowStateCommand
  | ToggleWindowStateCommand
  | AdjustBordersCommand
  | ChangeFocusModeCommand
  | ChangeTilingDirectionCommand
  | ExitWmCommand
  | ReloadConfigCommand
  | CloseWindowCommand
  | ExecProcessCommand
  | IgnoreCommand;
