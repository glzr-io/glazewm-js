import { WmEventType } from '../wm-events';

export interface WorkspaceDeactivatedEvent {
  eventType: WmEventType.WORKSPACE_DEACTIVATED;
  deactivatedId: string;
  deactivatedName: string;
}
