import { ContainerType } from './container-type';

export interface Container {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ContainerType;
  focusIndex: number;
  children: Container[];
}
