import type { Monitor } from '../shared';
import { WmEventType } from '../wm-events';

export interface WorkingAreaResizedEvent {
  type: WmEventType.WorkingAreaResized;
  affectedMonitor: Monitor;
}
