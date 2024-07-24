import { ContainerType } from './container-type';
import type { Workspace } from './workspace';

export interface Monitor {
  type: ContainerType.MONITOR;
  id: string;
  parent: string;
  childFocusOrder: string[];
  children: Workspace[];
  dpi: number;
  width: number;
  height: number;
  x: number;
  y: number;
}
