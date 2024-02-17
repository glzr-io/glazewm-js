import { ContainerType } from './container-type';
import type { Window } from './window';

export interface FullscreenWindow extends Window {
  type: ContainerType.FullscreenWindow;
}
