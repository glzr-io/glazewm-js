export interface Container {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  focusIndex: number;
  children: Container[];
}
