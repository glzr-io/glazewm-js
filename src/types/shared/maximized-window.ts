import { ContainerType } from './container-type';
import type { Window } from './window';

export interface MaximizedWindow extends Window {
  type: ContainerType.MaximizedWindow;
}
