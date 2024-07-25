import { WmEventType } from '../wm-events';

export interface WorkspaceDeactivatedEvent {
  type: WmEventType.WORKSPACE_DEACTIVATED;
  deactivatedId: string;
  deactivatedName: string;
}
