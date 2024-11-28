import type {
  ApplicationExitingEvent,
  BindingModesChangedEvent,
  FocusChangedEvent,
  FocusedContainerMovedEvent,
  MonitorAddedEvent,
  MonitorRemovedEvent,
  MonitorUpdatedEvent,
  PauseChangedEvent,
  TilingDirectionChangedEvent,
  UserConfigChangedEvent,
  WindowManagedEvent,
  WindowUnmanagedEvent,
  WorkspaceActivatedEvent,
  WorkspaceDeactivatedEvent,
  WorkspaceUpdatedEvent,
} from './events';

/**
 * All possible GlazeWM event types (e.g. `'focus_changed'`).
 */
export enum WmEventType {
  ALL = 'all',
  APPLICATION_EXITING = 'application_exiting',
  BINDING_MODES_CHANGED = 'binding_modes_changed',
  FOCUS_CHANGED = 'focus_changed',
  FOCUSED_CONTAINER_MOVED = 'focused_container_moved',
  MONITOR_ADDED = 'monitor_added',
  MONITOR_UPDATED = 'monitor_updated',
  MONITOR_REMOVED = 'monitor_removed',
  TILING_DIRECTION_CHANGED = 'tiling_direction_changed',
  USER_CONFIG_CHANGED = 'user_config_changed',
  WINDOW_MANAGED = 'window_managed',
  WINDOW_UNMANAGED = 'window_unmanaged',
  WORKSPACE_ACTIVATED = 'workspace_activated',
  WORKSPACE_DEACTIVATED = 'workspace_deactivated',
  WORKSPACE_UPDATED = 'workspace_updated',
  PAUSE_CHANGED = 'pause_changed',
}

/**
 * All possible GlazeWM event interfaces.
 */
export type WmEvent =
  | ApplicationExitingEvent
  | BindingModesChangedEvent
  | FocusChangedEvent
  | FocusedContainerMovedEvent
  | MonitorAddedEvent
  | MonitorUpdatedEvent
  | MonitorRemovedEvent
  | TilingDirectionChangedEvent
  | UserConfigChangedEvent
  | WindowManagedEvent
  | WindowUnmanagedEvent
  | WorkspaceActivatedEvent
  | WorkspaceDeactivatedEvent
  | WorkspaceUpdatedEvent
  | PauseChangedEvent;

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
  [WmEventType.BINDING_MODES_CHANGED]: BindingModesChangedEvent;
  [WmEventType.FOCUS_CHANGED]: FocusChangedEvent;
  [WmEventType.FOCUSED_CONTAINER_MOVED]: FocusedContainerMovedEvent;
  [WmEventType.MONITOR_ADDED]: MonitorAddedEvent;
  [WmEventType.MONITOR_REMOVED]: MonitorRemovedEvent;
  [WmEventType.MONITOR_UPDATED]: MonitorUpdatedEvent;
  [WmEventType.TILING_DIRECTION_CHANGED]: TilingDirectionChangedEvent;
  [WmEventType.WINDOW_MANAGED]: WindowManagedEvent;
  [WmEventType.WINDOW_UNMANAGED]: WindowUnmanagedEvent;
  [WmEventType.USER_CONFIG_CHANGED]: UserConfigChangedEvent;
  [WmEventType.WORKSPACE_ACTIVATED]: WorkspaceActivatedEvent;
  [WmEventType.WORKSPACE_DEACTIVATED]: WorkspaceDeactivatedEvent;
  [WmEventType.WORKSPACE_UPDATED]: WorkspaceUpdatedEvent;
  [WmEventType.PAUSE_CHANGED]: PauseChangedEvent;
}[T];
