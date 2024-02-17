import { WmEventType } from '../wm-events';
import { Container } from '../shared';

export interface FocusedContainerMovedEvent {
  type: WmEventType.FocusedContainerMoved;
  focusedContainer: Container;
}
