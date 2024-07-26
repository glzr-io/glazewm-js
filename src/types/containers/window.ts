import type {
  Rect,
  RectDelta,
  WindowState,
  DisplayState,
} from '../common';
import type { ContainerType } from './container-type';

export interface Window {
  id: string;
  type: ContainerType.WINDOW;
  parentId: string;
  hasFocus: boolean;
  floatingPlacement: Rect;
  borderDelta: RectDelta;
  handle: number;
  tilingSize: number | null;
  state: WindowState;
  prevState: WindowState | null;
  displayState: DisplayState;
  title: string;
  processName: string;
  className: string;
  width: number;
  height: number;
  x: number;
  y: number;
}
