import { ContainerType } from './container-type';
import type { Window } from './window';

export interface TilingWindow extends Window {
  type: ContainerType.TilingWindow;
  sizePercentage: number;
}
