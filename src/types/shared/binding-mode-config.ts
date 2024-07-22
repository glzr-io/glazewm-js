import type { KeybindingConfig } from './keybinding-config';

export interface BindingModeConfig {
  name: string;
  displayName: string;
  keybindings: KeybindingConfig;
}
