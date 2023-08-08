import { GwmEventType } from '../gwm-events';
import { TilingDirection } from '../shared';

export interface LayoutChangedEvent {
  type: GwmEventType.LAYOUT_CHANGED;
  newLayout: TilingDirection;
}
