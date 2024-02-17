import { WmEventType } from '../wm-events';
import { Workspace } from '../shared';

export interface WorkspaceActivatedEvent {
  type: WmEventType.BindingModeChanged;
  activatedWorkspace: Workspace;
}
