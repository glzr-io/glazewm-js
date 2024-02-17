import { WmEventType } from '../wm-events';

export interface WorkspaceDeactivatedEvent {
  type: WmEventType.WorkspaceDeactivated;
  removedId: string;
  removedName: string;
}
