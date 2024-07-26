import { TilingDirection } from '../common';
import type { SplitContainer, Workspace } from '../containers';
import { WmEventType } from '../wm-events';

export interface TilingDirectionChangedEvent {
  eventType: WmEventType.TILING_DIRECTION_CHANGED;
  newTilingDirection: TilingDirection;
  directionContainer: SplitContainer | Workspace;
}
