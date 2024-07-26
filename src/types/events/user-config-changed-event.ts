import { WmEventType } from '../wm-events';

export interface UserConfigChangedEvent {
  eventType: WmEventType.USER_CONFIG_CHANGED;
  configPath: string;
  configString: string;
  // TODO: Add a type for the parsed config.
  parsedConfig: any;
}
