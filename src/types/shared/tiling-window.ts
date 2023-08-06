import { Window } from './window';

export interface TilingWindow extends Window {
  type: 'tiling_window';
  sizePercentage: number;
}
