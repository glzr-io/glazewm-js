/**
 * Get instance of `Websocket` to use. Uses the `Websocket` web API when running
 * in the browser, otherwise uses `ws` when running Node.
 */
export async function resolveWebSocketApi() {
  return globalThis.WebSocket ?? import('ws');
}
