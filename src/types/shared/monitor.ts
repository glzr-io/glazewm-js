import { Container } from './container';
import { ContainerType } from './container-type';
import { Workspace } from './workspace';

export interface Monitor extends Container {
  type: ContainerType.Monitor;
  deviceName: string;
  children: Workspace[];
}
