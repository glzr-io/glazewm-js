import { WmEventType } from '../wm-events';

export interface MonitorRemovedEvent {
  type: WmEventType.MonitorRemoved;
  removedId: string;
  removedDeviceName: string;
}
