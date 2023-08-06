import { Container } from './container';
import { TilingDirection } from './tiling-direction';
import { Window } from './window';

export interface SplitContainer extends Container {
  type: 'split_container';
  layout: TilingDirection;
  sizePercentage: number;
  children: (Window | SplitContainer)[];
}
