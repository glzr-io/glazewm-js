import type { BindingModeConfig } from '../config';
import { WmEventType } from '../wm-events';

export interface BindingModesChangedEvent {
  eventType: WmEventType.BINDING_MODES_CHANGED;
  newBindingModes: BindingModeConfig[];
}
