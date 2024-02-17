import { ContainerType } from './container-type';
import type { Window } from './window';
import { WindowState } from './window-state';

export interface MinimizedWindow extends Window {
  type: ContainerType.MinimizedWindow;
  previousState: WindowState;
}
