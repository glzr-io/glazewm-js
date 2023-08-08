import WebSocket from 'ws';

/**
 * Instance of `Websocket` to use. Uses the `Websocket` web API when running in
 * the browser, otherwise uses `ws` when running Node.
 */
export default globalThis.WebSocket ?? WebSocket;
