import { ContainerType } from './container-type';
import { Window } from './window';
import { WindowState } from './window-state';

export interface MinimizedWindow extends Window {
  type: ContainerType.MinimizedWindow;
  previousState: WindowState;
}
