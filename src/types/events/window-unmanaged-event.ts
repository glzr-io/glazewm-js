import { WmEventType } from '../wm-events';

export interface WindowUnmanagedEvent {
  type: WmEventType.WindowUnmanaged;
  unmanagedId: string;
  unmanagedHandle: number;
}
