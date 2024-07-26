import { ContainerType } from './container-type';
import type { Monitor } from './monitor';

export interface RootContainer {
  id: string;
  type: ContainerType.ROOT;
  parentId: null;
  childFocusOrder: string[];
  children: Monitor[];
}
