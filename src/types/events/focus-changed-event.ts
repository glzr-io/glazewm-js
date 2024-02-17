import { WmEventType } from '../wm-events';
import type { Container } from '../shared';

export interface FocusChangedEvent {
  type: WmEventType.FocusChanged;
  focusedContainer: Container;
}
