import { GwmEventType } from '../gwm-events';
import { TilingDirection } from '../shared';

export interface TilingDirectionChangedEvent {
  type: GwmEventType.TILING_DIRECTION_CHANGED;
  newTilingDirection: TilingDirection;
}
