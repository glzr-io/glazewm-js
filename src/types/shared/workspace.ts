import { Container } from './container';
import { Window } from './window';
import { SplitContainer } from './split-container';
import { TilingDirection } from './tiling-direction';
import { ContainerType } from './container-type';
import { FloatingWindow } from './floating-window';
import { FullscreenWindow } from './fullscreen-window';
import { MaximizedWindow } from './maximized-window';
import { MinimizedWindow } from './minimized-window';
import { TilingWindow } from './tiling-window';

export interface Workspace extends Container {
  type: ContainerType.Workspace;
  layout: TilingDirection;
  sizePercentage: number;
  name: string;
  children: (
    | SplitContainer
    | TilingWindow
    | FloatingWindow
    | MinimizedWindow
    | MaximizedWindow
    | FullscreenWindow
  )[];
}
