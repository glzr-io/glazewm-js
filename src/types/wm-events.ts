import type {
  ApplicationExitingEvent,
  BindingModeChangedEvent,
  FocusChangedEvent,
  FocusedContainerMovedEvent,
  MonitorAddedEvent,
  MonitorRemovedEvent,
  TilingDirectionChangedEvent,
  UserConfigReloadedEvent,
  WindowManagedEvent,
  WindowUnmanagedEvent,
  WorkspaceActivatedEvent,
  WorkspaceDeactivatedEvent,
  WorkingAreaResizedEvent,
} from './events';

/**
 * All possible GlazeWM event types (eg. `'focus_changed'`).
 */
export enum WmEventType {
  All = 'all',
  BindingModeChanged = 'binding_mode_changed',
  FocusChanged = 'focus_changed',
  FocusedContainerMoved = 'focused_container_moved',
  MonitorAdded = 'monitor_added',
  MonitorRemoved = 'monitor_removed',
  TilingDirectionChanged = 'tiling_direction_changed',
  UserConfigReloaded = 'user_config_reloaded',
  WindowManaged = 'window_managed',
  WindowUnmanaged = 'window_unmanaged',
  WorkspaceActivated = 'workspace_activated',
  WorkspaceDeactivated = 'workspace_deactivated',
  WorkingAreaResized = 'working_area_resized',
  ApplicationExiting = 'application_exiting',
}

/**
 * All possible GlazeWM event interfaces.
 */
export type WmEvent =
  | ApplicationExitingEvent
  | BindingModeChangedEvent
  | FocusChangedEvent
  | FocusedContainerMovedEvent
  | MonitorAddedEvent
  | MonitorRemovedEvent
  | TilingDirectionChangedEvent
  | UserConfigReloadedEvent
  | WindowManagedEvent
  | WindowUnmanagedEvent
  | WorkspaceActivatedEvent
  | WorkspaceDeactivatedEvent
  | WorkingAreaResizedEvent;

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
  [WmEventType.ApplicationExiting]: ApplicationExitingEvent;
  [WmEventType.BindingModeChanged]: BindingModeChangedEvent;
  [WmEventType.FocusChanged]: FocusChangedEvent;
  [WmEventType.FocusedContainerMoved]: FocusedContainerMovedEvent;
  [WmEventType.MonitorAdded]: MonitorAddedEvent;
  [WmEventType.MonitorRemoved]: MonitorRemovedEvent;
  [WmEventType.TilingDirectionChanged]: TilingDirectionChangedEvent;
  [WmEventType.WindowManaged]: WindowManagedEvent;
  [WmEventType.WindowUnmanaged]: WindowUnmanagedEvent;
  [WmEventType.UserConfigReloaded]: UserConfigReloadedEvent;
  [WmEventType.WorkspaceActivated]: WorkspaceActivatedEvent;
  [WmEventType.WorkspaceDeactivated]: WorkspaceDeactivatedEvent;
  [WmEventType.WorkingAreaResized]: WorkingAreaResizedEvent;
}[T];
