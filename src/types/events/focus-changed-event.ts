import { WmEventType } from '../wm-events';
import { Container } from '../shared';

export interface FocusChangedEvent {
  type: WmEventType.FocusChanged;
  focusedContainer: Container;
}
