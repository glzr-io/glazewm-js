import { WmEventType } from '../wm-events';
import { TilingDirection } from '../common';

export interface TilingDirectionChangedEvent {
  type: WmEventType.TILING_DIRECTION_CHANGED;
  newTilingDirection: TilingDirection;
}
