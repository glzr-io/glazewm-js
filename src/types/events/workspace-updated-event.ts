import type { Workspace } from '../containers';
import { WmEventType } from '../wm-events';

export interface WorkspaceUpdatedEvent {
  eventType: WmEventType.WORKSPACE_UPDATED;
  updatedWorkspace: Workspace;
}
