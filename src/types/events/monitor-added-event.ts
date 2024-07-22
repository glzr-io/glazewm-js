import { WmEventType } from '../wm-events';
import type { Monitor } from '../shared';

export interface MonitorAddedEvent {
  type: WmEventType.MONITOR_ADDED;
  addedMonitor: Monitor;
}
