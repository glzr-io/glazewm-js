import { ContainerType } from './container-type';
import { Window } from './window';

export interface TilingWindow extends Window {
  type: ContainerType.TilingWindow;
  sizePercentage: number;
}
