import { ContainerType } from './container-type';
import { Window } from './window';

export interface MaximizedWindow extends Window {
  type: ContainerType.MaximizedWindow;
}
