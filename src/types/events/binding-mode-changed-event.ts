import { WmEventType } from '../wm-events';

export interface BindingModeChangedEvent {
  type: WmEventType.BindingModeChanged;
  bindingMode: string;
}
