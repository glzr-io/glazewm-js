interface BorderRectDelta {
  amount: number;
  //TODO: remove percentage?
  unit: 'pixel' | 'percentage';
}

export interface BorderDelta {
  left: BorderRectDelta;
  top: BorderRectDelta;
  right: BorderRectDelta;
  bottom: BorderRectDelta;
}
