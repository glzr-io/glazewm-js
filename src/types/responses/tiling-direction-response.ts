import { TilingDirection } from '../common';
import type { SplitContainer, Workspace } from '../containers';

export interface TilingDirectionResponse {
  tilingDirection: TilingDirection;
  directionContainer: Workspace | SplitContainer;
}
