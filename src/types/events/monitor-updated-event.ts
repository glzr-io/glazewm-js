import { WmEventType } from '../wm-events';
import type { Monitor } from '../shared';

export interface MonitorUpdatedEvent {
  type: WmEventType.MONITOR_UPDATED;
  updatedMonitor: Monitor;
}
