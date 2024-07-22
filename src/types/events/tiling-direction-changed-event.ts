import { WmEventType } from '../wm-events';
import { TilingDirection } from '../shared';

export interface TilingDirectionChangedEvent {
  type: WmEventType.TILING_DIRECTION_CHANGED;
  newTilingDirection: TilingDirection;
}
