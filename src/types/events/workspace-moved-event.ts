import type { Monitor, Workspace } from '../containers';
import { WmEventType } from '../wm-events';

export interface WorkspaceMovedEvent {
  type: WmEventType.WORKSPACE_MOVED;
  movedWorkspace: Workspace;
  newMonitor: Monitor;
}
