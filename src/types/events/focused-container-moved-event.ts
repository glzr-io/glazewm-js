import { WmEventType } from '../wm-events';
import type { Container } from '../shared';

export interface FocusedContainerMovedEvent {
  type: WmEventType.FOCUSED_CONTAINER_MOVED;
  focusedContainer: Container;
}
