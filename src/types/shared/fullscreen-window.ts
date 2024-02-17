import { ContainerType } from './container-type';
import { Window } from './window';

export interface FullscreenWindow extends Window {
  type: ContainerType.FullscreenWindow;
}
