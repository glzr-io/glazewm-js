import type { Window } from '../containers';
import { WmEventType } from '../wm-events';

export interface WindowManagedEvent {
  eventType: WmEventType.WINDOW_MANAGED;
  managedWindow: Window;
}
