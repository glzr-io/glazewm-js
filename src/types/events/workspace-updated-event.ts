import type { Workspace } from '../containers';
import { WmEventType } from '../wm-events';

export interface WorkspaceUpdatedEvent {
  type: WmEventType.WORKSPACE_UPDATED;
  updatedWorkspace: Workspace;
}
