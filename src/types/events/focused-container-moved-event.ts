import { WmEventType } from '../wm-events';
import type { Container } from '../containers';

export interface FocusedContainerMovedEvent {
  type: WmEventType.FOCUSED_CONTAINER_MOVED;
  focusedContainer: Container;
}
