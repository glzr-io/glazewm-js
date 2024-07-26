import type { BindingModeConfig } from '../config';
import { WmEventType } from '../wm-events';

export interface BindingModesChangedEvent {
  type: WmEventType.BINDING_MODES_CHANGED;
  newBindingModes: BindingModeConfig[];
}
