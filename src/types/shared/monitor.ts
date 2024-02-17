import type { Container } from './container';
import { ContainerType } from './container-type';
import type { Workspace } from './workspace';

export interface Monitor extends Container {
  type: ContainerType.Monitor;
  deviceName: string;
  children: Workspace[];
}
