import { ContainerType } from './container-type';
import type { Monitor } from './monitor';

export interface RootContainer {
  id: string;
  type: ContainerType.ROOT;
  parent: null;
  childFocusOrder: string[];
  children: Monitor[];
}
