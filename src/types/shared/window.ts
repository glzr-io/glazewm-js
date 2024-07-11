import type { BorderDelta } from './border-delta';
import type { Container } from './container';
import type { FloatingPlacement } from './floating-placement';

interface WindowState {
  name: 'minimized' | 'fullscreen' | 'floating' | 'tiling';
}

type DisplayState = 'shown' | 'showing' | 'hidden' | 'hiding';

export interface Window extends Container {
  floatingPlacement: FloatingPlacement;
  borderDelta: BorderDelta;
  handle: number;
  children: []; //TODO: Container[] ?
  tilingSize?: number;
  state: WindowState;
  prevState?: WindowState;
  displayState: DisplayState;
  processName: string;
  className: string;
}
