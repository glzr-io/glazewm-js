import type { Window } from '../containers';
import { WmEventType } from '../wm-events';

export interface WindowManagedEvent {
  type: WmEventType.WINDOW_MANAGED;
  managedWindow: Window;
}
