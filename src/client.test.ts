import { WmClient } from './client';
import { TilingDirection } from './types';

describe.sequential('[CLIENT]', async () => {
  const client = new WmClient();

  // Wait for connection or timeout to ensure WM is running.
  beforeAll(() => client.connect(), 5000);

  describe('(query)', () => {
    it.concurrent('monitors', async () => {
      const { monitors } = await client.queryMonitors();
      expect(monitors.length).toBeGreaterThan(0);
    });

    it.concurrent('windows', async () => {
      const { windows } = await client.queryWindows();
      expect(windows.length).toBeGreaterThan(0);
    });

    it.concurrent('workspaces', async () => {
      const { workspaces } = await client.queryWorkspaces();
      expect(workspaces.length).toBeGreaterThan(0);
    });

    it.concurrent('focused', async () => {
      const { focused } = await client.queryFocused();
      expect(focused).toBeDefined();
    });

    it.concurrent('binding modes', async () => {
      const { bindingModes } = await client.queryBindingModes();
      expect(Array.isArray(bindingModes)).toBe(true);
    });

    it.concurrent('app metadata', async () => {
      const { version } = await client.queryAppMetadata();
      expect(typeof version).toBe('string');
    });

    it.concurrent('tiling direction', async () => {
      const { directionContainer, tilingDirection } =
        await client.queryTilingDirection();

      expect(directionContainer).toBeDefined();
      expect(
        tilingDirection === TilingDirection.HORIZONTAL ||
          tilingDirection === TilingDirection.VERTICAL,
      ).toBeTruthy();
    });
  });

  describe('(command)', () => {
    it('runs valid command', async () => {
      // Should always be able to redraw regardless of WM state.
      await client.runCommand('wm-redraw');
    });

    it('throws on invalid subject container', async () => {
      await expect(() =>
        // Pass an arbitrary container ID that doesn't exist.
        client.runCommand('close', 'ec428c12-4d1b-4696-8a07-7526202d42b5'),
      ).rejects.toThrow();
    });

    it('throws on invalid command', async () => {
      await expect(() => client.runCommand('invalid')).rejects.toThrow();
    });
  });
});
