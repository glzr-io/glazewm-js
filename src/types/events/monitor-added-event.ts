import { WmEventType } from '../wm-events';
import { Monitor } from '../shared';

export interface MonitorAddedEvent {
  type: WmEventType.MonitorAdded;
  addedMonitor: Monitor;
}
