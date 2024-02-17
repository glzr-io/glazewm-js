import type { Window } from '../shared';
import { WmEventType } from '../wm-events';

export interface WindowManagedEvent {
  type: WmEventType.WindowManaged;
  managedWindow: Window;
}
