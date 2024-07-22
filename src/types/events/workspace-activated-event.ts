import { WmEventType } from '../wm-events';
import type { Workspace } from '../shared';

export interface WorkspaceActivatedEvent {
  type: WmEventType.WORKSPACE_ACTIVATED;
  activatedWorkspace: Workspace;
}
