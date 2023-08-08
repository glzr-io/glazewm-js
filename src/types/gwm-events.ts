import {
  ApplicationExitingEvent,
  BindingModeChangedEvent,
  FocusChangedEvent,
  LayoutChangedEvent,
  MonitorAddedEvent,
  MonitorRemovedEvent,
  UserConfigReloadedEvent,
  WorkspaceActivatedEvent,
  WorkspaceDeactivatedEvent,
} from './events';

/** All possible GlazeWM event types (eg. `'focus_changed'`). */
export enum GwmEventType {
  ALL = 'all',
  BINDING_MODE_CHANGED = 'binding_mode_changed',
  FOCUS_CHANGED = 'focus_changed',
  LAYOUT_CHANGED = 'layout_changed',
  MONITOR_ADDED = 'monitor_added',
  MONITOR_REMOVED = 'monitor_removed',
  USER_CONFIG_RELOADED = 'user_config_reloaded',
  WORKSPACE_ACTIVATED = 'workspace_activated',
  WORKSPACE_DEACTIVATED = 'workspace_deactivated',
  APPLICATION_EXITING = 'application_exiting',
}

/** All possible GlazeWM event interfaces. */
export type GwmEvent =
  | BindingModeChangedEvent
  | FocusChangedEvent
  | LayoutChangedEvent
  | MonitorAddedEvent
  | MonitorRemovedEvent
  | UserConfigReloadedEvent
  | WorkspaceActivatedEvent
  | WorkspaceDeactivatedEvent
  | ApplicationExitingEvent;

/**
 * Utility type for getting event interface for given {@link GwmEventType}.
 *
 * @example
 * ```typescript
 * type Example = GwmEventData<GwmEventType.MONITOR_ADDED> // -> MonitorAddedEvent
 * ```
 */
export type GwmEventData<T extends GwmEventType = GwmEventType.ALL> = {
  [GwmEventType.ALL]: GwmEvent;
  [GwmEventType.BINDING_MODE_CHANGED]: BindingModeChangedEvent;
  [GwmEventType.FOCUS_CHANGED]: FocusChangedEvent;
  [GwmEventType.LAYOUT_CHANGED]: LayoutChangedEvent;
  [GwmEventType.MONITOR_ADDED]: MonitorAddedEvent;
  [GwmEventType.MONITOR_REMOVED]: MonitorRemovedEvent;
  [GwmEventType.USER_CONFIG_RELOADED]: UserConfigReloadedEvent;
  [GwmEventType.WORKSPACE_ACTIVATED]: WorkspaceActivatedEvent;
  [GwmEventType.WORKSPACE_DEACTIVATED]: WorkspaceDeactivatedEvent;
  [GwmEventType.APPLICATION_EXITING]: ApplicationExitingEvent;
}[T];
