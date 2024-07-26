import { TilingDirection } from '../common';
import { ContainerType } from './container-type';
import type { SplitContainer } from './split-container';
import type { Window } from './window';

export interface Workspace {
  id: string;
  type: ContainerType.WORKSPACE;
  parentId: string;
  childFocusOrder: string[];
  children: (SplitContainer | Window)[];
  hasFocus: boolean;
  isDisplayed: boolean;
  name: string;
  displayName: string;
  tilingDirection: TilingDirection;
  width: number;
  height: number;
  x: number;
  y: number;
}
