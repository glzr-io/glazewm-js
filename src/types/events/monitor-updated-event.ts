import { WmEventType } from '../wm-events';
import type { Monitor } from '../containers';

export interface MonitorUpdatedEvent {
  eventType: WmEventType.MONITOR_UPDATED;
  updatedMonitor: Monitor;
}
