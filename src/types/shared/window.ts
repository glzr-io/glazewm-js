import { BorderDelta } from './border-delta';
import { Container } from './container';
import { FloatingPlacement } from './floating-placement';

export interface Window extends Container {
  floatingPlacement: FloatingPlacement;
  borderDelta: BorderDelta;
  handle: number;
  children: [];
}
