import {
  ApplicationExitingEvent,
  BindingModeChangedEvent,
  FocusChangedEvent,
  TilingDirectionChangedEvent,
  MonitorAddedEvent,
  MonitorRemovedEvent,
  UserConfigReloadedEvent,
  WorkspaceActivatedEvent,
  WorkspaceDeactivatedEvent,
} from './events';

/**
 * All possible GlazeWM event types (eg. `'focus_changed'`).
 */
export enum WmEventType {
  All = 'all',
  BindingModeChanged = 'binding_mode_changed',
  FocusChanged = 'focus_changed',
  MonitorAdded = 'monitor_added',
  MonitorRemoved = 'monitor_removed',
  TilingDirectionChanged = 'tiling_direction_changed',
  UserConfigReloaded = 'user_config_reloaded',
  WorkspaceActivated = 'workspace_activated',
  WorkspaceDeactivated = 'workspace_deactivated',
  ApplicationExiting = 'application_exiting',
}

/**
 * All possible GlazeWM event interfaces.
 */
export type WmEvent =
  | BindingModeChangedEvent
  | FocusChangedEvent
  | MonitorAddedEvent
  | MonitorRemovedEvent
  | TilingDirectionChangedEvent
  | UserConfigReloadedEvent
  | WorkspaceActivatedEvent
  | WorkspaceDeactivatedEvent
  | ApplicationExitingEvent;

/**
 * Utility type for getting event interface for given {@link WmEventType}.
 *
 * @example
 * ```typescript
 * type Example = WmEventData<WmEventType.MONITOR_ADDED> // -> MonitorAddedEvent
 * ```
 */
export type WmEventData<T extends WmEventType = WmEventType.All> = {
  [WmEventType.All]: WmEvent;
  [WmEventType.BindingModeChanged]: BindingModeChangedEvent;
  [WmEventType.FocusChanged]: FocusChangedEvent;
  [WmEventType.MonitorAdded]: MonitorAddedEvent;
  [WmEventType.MonitorRemoved]: MonitorRemovedEvent;
  [WmEventType.TilingDirectionChanged]: TilingDirectionChangedEvent;
  [WmEventType.UserConfigReloaded]: UserConfigReloadedEvent;
  [WmEventType.WorkspaceActivated]: WorkspaceActivatedEvent;
  [WmEventType.WorkspaceDeactivated]: WorkspaceDeactivatedEvent;
  [WmEventType.ApplicationExiting]: ApplicationExitingEvent;
}[T];
