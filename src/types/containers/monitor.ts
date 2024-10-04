import type { Rect } from '../common';
import { ContainerType } from './container-type';
import type { Workspace } from './workspace';

export interface Monitor {
  id: string;
  type: ContainerType.MONITOR;
  parentId: string;
  childFocusOrder: string[];
  children: Workspace[];
  hasFocus: boolean;
  dpi: number;
  scaleFactor: number;
  width: number;
  height: number;
  x: number;
  y: number;
  handle: number;
  deviceName: string;
  devicePath: string | null;
  hardwareId: string | null;
  workingRect: Rect;
}
