import { WebSocket as WS } from 'ws';

declare global {
  var WebSocket: typeof WS;
}
