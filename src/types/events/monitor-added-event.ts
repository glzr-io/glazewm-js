import { WmEventType } from '../wm-events';
import type { Monitor } from '../containers';

export interface MonitorAddedEvent {
  eventType: WmEventType.MONITOR_ADDED;
  addedMonitor: Monitor;
}
