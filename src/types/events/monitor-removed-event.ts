import { GwmEventType } from '../gwm-events';

export interface MonitorRemovedEvent {
  type: GwmEventType.MONITOR_REMOVED;
  removedId: string;
  removedDeviceName: string;
}
