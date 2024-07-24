import type { ContainerType } from './container-type';
import type { DisplayState } from '../shared/display-state';
import type { FloatingPlacement } from '../shared/floating-placement';
import type { RectDelta } from '../shared/rect-delta';
import type { WindowState } from '../shared/window-state';

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
