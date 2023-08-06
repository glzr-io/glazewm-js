import { Container } from './container';
import { Window } from './window';
import { SplitContainer } from './split-container';
import { TilingDirection } from './tiling-direction';

export interface Workspace extends Container {
  type: 'workspace';
  layout: TilingDirection;
  sizePercentage: number;
  name: string;
  children: (Window | SplitContainer)[];
}
