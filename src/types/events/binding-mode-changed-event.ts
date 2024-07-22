import { WmEventType } from '../wm-events';

export interface BindingModeChangedEvent {
  type: WmEventType.BINDING_MODE_CHANGED;
  bindingMode: string;
}
