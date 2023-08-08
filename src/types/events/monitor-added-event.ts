import { GwmEventType } from '../gwm-events';
import { Monitor } from '../shared';

export interface MonitorAddedEvent {
  type: GwmEventType.MONITOR_ADDED;
  addedMonitor: Monitor;
}
