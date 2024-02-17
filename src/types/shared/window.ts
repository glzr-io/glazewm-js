import type { BorderDelta } from './border-delta';
import type { Container } from './container';
import type { FloatingPlacement } from './floating-placement';

export interface Window extends Container {
  floatingPlacement: FloatingPlacement;
  borderDelta: BorderDelta;
  handle: number;
  children: [];
}
