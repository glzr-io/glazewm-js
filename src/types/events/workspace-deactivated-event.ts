import { GwmEventType } from '../gwm-events';

export interface WorkspaceDeactivatedEvent {
  type: GwmEventType.WORKSPACE_DEACTIVATED;
  removedId: string;
  removedName: string;
}
