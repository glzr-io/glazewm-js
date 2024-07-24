import type { Monitor } from './monitor';
import type { RootContainer } from './root-container';
import type { SplitContainer } from './split-container';
import type { Window } from './window';
import type { Workspace } from './workspace';

export type Container =
  | RootContainer
  | Monitor
  | Workspace
  | SplitContainer
  | Window;
