import { ContainerType } from './container-type';
import { Window } from './window';

export interface FloatingWindow extends Window {
  type: ContainerType.FloatingWindow;
}
