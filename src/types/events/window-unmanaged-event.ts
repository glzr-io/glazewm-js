import { WmEventType } from '../wm-events';

export interface WindowUnmanagedEvent {
  type: WmEventType.WINDOW_UNMANAGED;
  unmanagedId: string;
  unmanagedHandle: number;
}
