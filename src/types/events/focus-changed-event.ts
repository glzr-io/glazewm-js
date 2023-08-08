import { GwmEventType } from '../gwm-events';
import { Container } from '../shared';

export interface FocusChangedEvent {
  type: GwmEventType.FOCUS_CHANGED;
  focusedContainer: Container;
}
