# GlazeWM-js &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/glzr-io/GlazeWM-js/pulls) [![License](https://img.shields.io/github/license/glzr-io/glazewm-js)](https://github.com/glzr-io/glazewm-js/blob/main/LICENSE.md) [![Discord invite](https://img.shields.io/discord/1041662798196908052.svg?logo=discord&colorB=7289DA)](https://discord.gg/ud6z3qjRvM)

JS library for inter-process communication (IPC) with [GlazeWM](https://github.com/glzr-io/GlazeWM). Programmatically query GlazeWM's state, subscribe to events, and run WM commands with a simple and type-safe API.

The library is packaged for CommonJS and ESM. Can be used from both NodeJS and the browser (eg. in an Electron or Tauri application).

## Installation

[ws](https://github.com/websockets/ws) needs to be additionally installed on NodeJS. The built-in [Websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) API is used on browsers.

Using npm:

```shell
npm i ws
npm i glazewm
```

Using yarn:

```shell
yarn add ws
yarn add glazewm
```

## Example usage

```typescript
import { WmClient } from 'glazewm';

const client = new WmClient();

// Listen for connection events to the IPC server.
client.onConnect(() => console.log('Connected!'));
client.onDisconnect(() => console.log('Disconnected!'));
client.onError(() => console.log('Connection error!'));

// Get monitors, active workspaces, and windows.
const monitors = await client.getMonitors();
const workspaces = await client.getWorkspaces();
const windows = await client.getWindows();

// Run a WM command.
await client.runCommand('focus workspace 1');

// Run a WM command with a given context container. This way we can target the
// container to operate on. If no context container is specified, it defaults to
// the currently focused container.
await client.runCommand('move left', windows[0]);

// Listen to a WM event (eg. whenever the focused container changes).
await client.subscribe(
  WmEventType.FocusChanged,
  (event: FocusChangedEvent) => console.log(event),
);

// Listen to multiple WM events.
await client.subscribeMany(
  [WmEventType.WorkspaceActivated, WmEventType.WorkspaceDeactivated],
  (event: WorkspaceActivatedEvent | WorkspaceDeactivatedEvent) =>
    console.log(event),
);
```
