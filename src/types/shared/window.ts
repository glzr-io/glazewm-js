import type { ContainerType } from './container-type';
import type { DisplayState } from './display-state';
import type { FloatingPlacement } from './floating-placement';
import type { RectDelta } from './rect-delta';
import type { WindowState } from './window-state';

export interface Window {
  type: ContainerType.WINDOW;
  id: string;
  parent: string;
  floatingPlacement: FloatingPlacement;
  borderDelta: RectDelta;
  handle: number;
  tilingSize?: number;
  state: WindowState;
  prevState?: WindowState;
  displayState: DisplayState;
  processName: string;
  className: string;
  width: number;
  height: number;
  x: number;
  y: number;
}
