import { Container } from './container';
import { ContainerType } from './container-type';
import { Monitor } from './monitor';

export interface RootContainer extends Container {
  type: ContainerType.RootContainer;
  children: Monitor[];
}
