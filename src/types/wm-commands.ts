export type Direction = 'left' | 'right' | 'up' | 'down';
export type ResizeDimension = 'height' | 'width';

export type FocusInDirectionCommand = `focus ${Direction}`;
export type FocusWorkspaceCommand = `focus workspace ${string}`;
export type MoveWindowCommand = `move ${Direction}`;
export type MoveWindowToWorkspaceCommand = `move to workspace ${string}`;
export type SetWindowSizeCommand = `set ${ResizeDimension} ${string}`;
export type ResizeWindowCommand = `resize ${ResizeDimension} ${string}`;
export type ResizeWindowBordersCommand = `resize borders ${string}`;
export type SetWindowStateCommand = `set ${
  | 'floating'
  | 'tiling'
  | 'minimized'
  | 'maximized'}`;
export type ToggleWindowStateCommand = `toggle ${'floating' | 'maximized'}`;
export type ChangeFocusModeCommand = 'focus mode toggle';
export type ChangeTilingDirectionCommand = `tiling direction ${
  | 'vertical'
  | 'horizontal'
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
