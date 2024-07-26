import { WmEventType } from '../wm-events';
import type { Workspace } from '../containers';

export interface WorkspaceActivatedEvent {
  eventType: WmEventType.WORKSPACE_ACTIVATED;
  activatedWorkspace: Workspace;
}
