import type { WindowType } from './window-type';

export type WindowState =
  | { type: WindowType.FLOATING; centered: boolean; shownOnTop: boolean }
  | {
      type: WindowType.FULLSCREEN;
      maximized: boolean;
      shownOnTop: boolean;
    }
  | { type: WindowType.MINIMIZED }
  | { type: WindowType.TILING };
