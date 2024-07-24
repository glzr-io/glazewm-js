import type { SplitContainer } from './split-container';
import { TilingDirection } from '../shared/tiling-direction';
import { ContainerType } from './container-type';
import type { Window } from './window';

export interface Workspace {
  type: ContainerType.WORKSPACE;
  id: string;
  parent: string;
  childFocusOrder: string[];
  children: (SplitContainer | Window)[];
  name: string;
  tilingDirection: TilingDirection;
  isDisplayed: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
}
