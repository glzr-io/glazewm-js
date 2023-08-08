import { GwmEventType } from '../gwm-events';
import { Workspace } from '../shared';

export interface WorkspaceActivatedEvent {
  type: GwmEventType.BINDING_MODE_CHANGED;
  activatedWorkspace: Workspace;
}
