import { WmEventType } from '../wm-events';
import { TilingDirection } from '../shared';

export interface TilingDirectionChangedEvent {
  type: WmEventType.TilingDirectionChanged;
  newTilingDirection: TilingDirection;
}
