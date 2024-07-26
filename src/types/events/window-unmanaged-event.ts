import { WmEventType } from '../wm-events';

export interface WindowUnmanagedEvent {
  eventType: WmEventType.WINDOW_UNMANAGED;
  unmanagedId: string;
  unmanagedHandle: number;
}
