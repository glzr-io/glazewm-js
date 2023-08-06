import { Window } from './window';

export interface MinimizedWindow extends Window {
  type: 'minimized_window';
  previousState: 'tiling';
}
