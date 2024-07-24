import { ContainerType } from './container-type';
import { TilingDirection } from '../common/tiling-direction';
import type { Window } from './window';

export interface SplitContainer {
  type: ContainerType.SPLIT;
  id: string;
  parent: string;
  childFocusOrder: string[];
  children: (SplitContainer | Window)[];
  tilingDirection: TilingDirection;
  tilingSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
}
