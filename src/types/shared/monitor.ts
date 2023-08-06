import { Container } from './container';
import { Workspace } from './workspace';

export interface Monitor extends Container {
  type: 'monitor';
  deviceName: string;
  children: Workspace[];
}
