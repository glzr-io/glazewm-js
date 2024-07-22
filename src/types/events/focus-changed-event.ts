import { WmEventType } from '../wm-events';
import type { Container } from '../shared';

export interface FocusChangedEvent {
  type: WmEventType.FOCUS_CHANGED;
  focusedContainer: Container;
}
