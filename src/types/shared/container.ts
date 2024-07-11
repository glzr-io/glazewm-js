import { ContainerType } from './container-type';

export interface Container {
  type: ContainerType;
  id: string;
  parent?: string;
  children: Container[];
  childFocusOrder: string[];
  width: number;
  height: number;
  x: number;
  y: number;
  // focusIndex: number;
}
