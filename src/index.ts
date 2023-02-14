import { WebSocketServer } from 'ws';

export const wss = new WebSocketServer({
  port: 61423,
});
