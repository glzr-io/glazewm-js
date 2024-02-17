import { Container } from './container';
import { ContainerType } from './container-type';
import { FloatingWindow } from './floating-window';
import { FullscreenWindow } from './fullscreen-window';
import { MaximizedWindow } from './maximized-window';
import { MinimizedWindow } from './minimized-window';
import { TilingDirection } from './tiling-direction';
import { TilingWindow } from './tiling-window';

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
