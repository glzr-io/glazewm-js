import type { Container } from './container';
import type { SplitContainer } from './split-container';
import { TilingDirection } from './tiling-direction';
import { ContainerType } from './container-type';
import type { FloatingWindow } from './floating-window';
import type { FullscreenWindow } from './fullscreen-window';
import type { MaximizedWindow } from './maximized-window';
import type { MinimizedWindow } from './minimized-window';
import type { TilingWindow } from './tiling-window';

export interface Workspace extends Container {
  name: string;
  type: ContainerType.Workspace;
  tilingDirection: TilingDirection;
  isDisplayed: boolean;
  children: (
    | SplitContainer
    | TilingWindow
    | FloatingWindow
    | MinimizedWindow
    | MaximizedWindow
    | FullscreenWindow
  )[];
}
