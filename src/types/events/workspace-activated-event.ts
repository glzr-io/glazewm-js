import { WmEventType } from '../wm-events';
import type { Workspace } from '../containers';

export interface WorkspaceActivatedEvent {
  type: WmEventType.WORKSPACE_ACTIVATED;
  activatedWorkspace: Workspace;
}
