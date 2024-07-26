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
  width: number;
  height: number;
  x: number;
  y: number;
  handle: number;
  device_name: string;
  device_path: string | null;
  hardware_id: string | null;
  working_rect: Rect;
}
