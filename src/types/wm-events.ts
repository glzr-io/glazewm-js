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
 * All possible GlazeWM event types (e.g. `'focus_changed'`).
 */
export enum WmEventType {
  ALL = 'all',
  BINDING_MODE_CHANGED = 'binding_mode_changed',
  FOCUS_CHANGED = 'focus_changed',
  FOCUSED_CONTAINER_MOVED = 'focused_container_moved',
  MONITOR_ADDED = 'monitor_added',
  MONITOR_REMOVED = 'monitor_removed',
  TILING_DIRECTION_CHANGED = 'tiling_direction_changed',
  USER_CONFIG_RELOADED = 'user_config_reloaded',
  WINDOW_MANAGED = 'window_managed',
  WINDOW_UNMANAGED = 'window_unmanaged',
  WORKSPACE_ACTIVATED = 'workspace_activated',
  WORKSPACE_DEACTIVATED = 'workspace_deactivated',
  WORKING_AREA_RESIZED = 'working_area_resized',
  APPLICATION_EXITING = 'application_exiting',
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
export type WmEventData<T extends WmEventType = WmEventType.ALL> = {
  [WmEventType.ALL]: WmEvent;
  [WmEventType.APPLICATION_EXITING]: ApplicationExitingEvent;
  [WmEventType.BINDING_MODE_CHANGED]: BindingModeChangedEvent;
  [WmEventType.FOCUS_CHANGED]: FocusChangedEvent;
  [WmEventType.FOCUSED_CONTAINER_MOVED]: FocusedContainerMovedEvent;
  [WmEventType.MONITOR_ADDED]: MonitorAddedEvent;
  [WmEventType.MONITOR_REMOVED]: MonitorRemovedEvent;
  [WmEventType.TILING_DIRECTION_CHANGED]: TilingDirectionChangedEvent;
  [WmEventType.WINDOW_MANAGED]: WindowManagedEvent;
  [WmEventType.WINDOW_UNMANAGED]: WindowUnmanagedEvent;
  [WmEventType.USER_CONFIG_RELOADED]: UserConfigReloadedEvent;
  [WmEventType.WORKSPACE_ACTIVATED]: WorkspaceActivatedEvent;
  [WmEventType.WORKSPACE_DEACTIVATED]: WorkspaceDeactivatedEvent;
  [WmEventType.WORKING_AREA_RESIZED]: WorkingAreaResizedEvent;
}[T];
