import { ContainerType } from './container-type';
import type { Window } from './window';

export interface FloatingWindow extends Window {
  type: ContainerType.FloatingWindow;
}
