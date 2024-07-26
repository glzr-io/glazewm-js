import { WmEventType } from '../wm-events';

export interface MonitorRemovedEvent {
  eventType: WmEventType.MONITOR_REMOVED;
  removedId: string;
  removedDeviceName: string;
}
