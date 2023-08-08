import { GwmEventType } from '../gwm-events';

export interface BindingModeChangedEvent {
  type: GwmEventType.BINDING_MODE_CHANGED;
  bindingMode: string;
}
