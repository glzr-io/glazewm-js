import type { Container } from './container';
import { ContainerType } from './container-type';
import type { Monitor } from './monitor';

export interface RootContainer extends Container {
  type: ContainerType.RootContainer;
  children: Monitor[];
}
