import type { Container } from './container';
import { ContainerType } from './container-type';
import type { FloatingWindow } from './floating-window';
import type { FullscreenWindow } from './fullscreen-window';
import type { MaximizedWindow } from './maximized-window';
import type { MinimizedWindow } from './minimized-window';
import { TilingDirection } from './tiling-direction';
import type { TilingWindow } from './tiling-window';

export interface SplitContainer extends Container {
  type: ContainerType.SplitContainer;
  layout: TilingDirection;
  sizePercentage: number;
  children: (
    | SplitContainer
    | TilingWindow
    | FloatingWindow
    | MinimizedWindow
    | MaximizedWindow
    | FullscreenWindow
  )[];
}
