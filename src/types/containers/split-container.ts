import { TilingDirection } from '../common';
import { ContainerType } from './container-type';
import type { Window } from './window';

export interface SplitContainer {
  id: string;
  type: ContainerType.SPLIT;
  parentId: string;
  childFocusOrder: string[];
  children: (SplitContainer | Window)[];
  hasFocus: boolean;
  tilingDirection: TilingDirection;
  tilingSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
}
