import { WmEventType } from '../wm-events';

export interface PauseChangedEvent {
  eventType: WmEventType.PAUSE_CHANGED;
  paused: boolean;
}
