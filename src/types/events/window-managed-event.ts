import type { Window } from '../shared';
import { WmEventType } from '../wm-events';

export interface WindowManagedEvent {
  type: WmEventType.WINDOW_MANAGED;
  managedWindow: Window;
}
