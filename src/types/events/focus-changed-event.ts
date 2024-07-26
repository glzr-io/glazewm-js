import { WmEventType } from '../wm-events';
import type { Window, Workspace } from '../containers';

export interface FocusChangedEvent {
  type: WmEventType.FOCUS_CHANGED;
  focusedContainer: Window | Workspace;
}
