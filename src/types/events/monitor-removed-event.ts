import { WmEventType } from '../wm-events';

export interface MonitorRemovedEvent {
  type: WmEventType.MONITOR_REMOVED;
  removedId: string;
  removedDeviceName: string;
}
