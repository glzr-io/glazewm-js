# GlazeWM &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lars-berger/GlazeWM-js/pulls) [![License](https://img.shields.io/github/license/lars-berger/GlazeWM-js)](https://github.com/lars-berger/GlazeWM-js/blob/master/LICENSE.md) [![Discord invite](https://img.shields.io/discord/1041662798196908052)](https://discord.gg/ud6z3qjRvM)

Library for inter-process communication (IPC) with [GlazeWM](https://github.com/lars-berger/GlazeWM). Programmatically query GlazeWM's state, subscribe to events, and run WM commands with a simple and type-safe API.

## Installation

Using npm:

```shell
npm i glazewm ws
```

## Example usage

```typescript
const client = new GwmClient();

// Listen for connection events to the IPC server.
client.onConnect(() => console.log('Connected!'));
client.onDisconnect(() => console.log('Disconnected!'));
client.onError(console.error);

// Get monitors, active workspaces, and windows.
const monitors = await client.getMonitors();
const workspaces = await client.getWorkspaces();
const windows = await client.getWindows();

// Run a WM command.
await client.runCommand('focus workspace 2');

// Run a WM command with a given context container. This way we can target the
// container to operate on. If no context container is specified, it defaults to
// the currently focused container.
await client.runCommand('move left', windows[0]);

// Listen to a WM event (eg. whenever the focused container changes).
await client.subscribe(
  GwmEventType.FOCUS_CHANGED,
  (event: FocusChangedEvent) => console.log(event),
});

// Listen to multiple WM events.
await client.subscribeMany(
  [GwmEventType.WORSPACE_ACTIVATED, GwmEventType.WORSPACE_DEACTIVATED],
  (event: WorkspaceActivatedEvent | WorkspaceDeactivatedEvent) =>
    console.log(event),
);
```
