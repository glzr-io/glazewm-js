import { WmEventType } from '../wm-events';
import type { Container } from '../containers';

export interface FocusChangedEvent {
  type: WmEventType.FOCUS_CHANGED;
  focusedContainer: Container;
}
