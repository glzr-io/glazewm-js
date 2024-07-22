import { spawn, exec } from 'child_process';
import { WmClient } from './client';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isProcessRunning(pid: number) {
  return await new Promise((resolve, reject) =>
    exec(`tasklist /fi "PID eq ${pid}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      if (stdout.includes(pid.toString())) {
        console.log('Process is still running');
        return resolve(true);
      } else {
        console.log('Process has been terminated');
        return resolve(false);
      }
    }),
  );
}

const INITIAL_CONNECT_TIMEOUT = 5000;
function timeout(duration: number) {
  return new Promise((_, reject) => setTimeout(() => reject(), duration));
}

describe.sequential('[CLIENT]', async () => {
  let client: WmClient;
  client = new WmClient();
  beforeAll(async () => {
    // wait for connection or timeout to ensure wm is running
    await Promise.race([
      client.connect(),
      timeout(INITIAL_CONNECT_TIMEOUT),
    ]);
  }, 4000);

  describe('(query)', () => {
    it.concurrent('monitors', async () => {
      const { monitors } = await client.getMonitors();
      expect(monitors?.length).toBeGreaterThan(0);
    });

    it.concurrent('windows', async () => {
      const { windows } = await client.getWindows();
      expect(windows?.length).toBeGreaterThan(0);
    });

    it.concurrent('workspaces', async () => {
      const { workspaces } = await client.getWorkspaces();
      expect(workspaces?.length).toBeGreaterThan(0);
    });

    it.concurrent('focused container', async () => {
      const focused = await client.getFocusedContainer();
      expect(focused).toBeDefined();
    });

    it.concurrent('binding mode', async () => {
      const { bindingModes } = await client.getBindingModes();
      // TODO: how do I trigger this at all?
      // extend tests when populatable
      // console.log(bindingModes);
      expect(bindingModes).toBeDefined();
    });
  });

  describe('(command)', () => {
    describe('adjust-border', async () => {
      afterAll(async () => {
        // reset border changes
        await client.adjustBorders({
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        });
      });
      it('top border', async () => {
        await client.adjustBorders({ top: '10px' });
      });
      it('right border', async () => {
        await client.adjustBorders({ right: '20px' });
      });
      it('bottom border', async () => {
        await client.adjustBorders({ bottom: '30px' });
      });
      it('left border', async () => {
        await client.adjustBorders({ left: '40px' });
      });
      it('all borders', async () => {
        await client.adjustBorders({
          top: '10px',
          right: '20px',
          bottom: '30px',
          left: '40px',
        });
      });
      it('with mixed units', async () => {
        await client.adjustBorders({
          top: '10px',
          right: '20',
          bottom: '30px',
          left: '40%',
        });
      });
    });
    it.skip('close', async () => {
      const process = spawn('cmd.exe', [], {
        stdio: 'inherit',
        detached: true,
        shell: true,
      });
      const processId = process.pid;
      process.unref();

      // allow time to pass for the window to open, tile and get focus
      await delay(4000).then(() => {
        if (!processId) {
          throw Error('Cannot test close command without process pid.');
        }
        client.closeCommand().then(async () => {
          expect(await isProcessRunning(processId)).toEqual(false);
        });
      });
    }, 6000);
    describe('focus', async () => {
      const { workspaces: originalWorkspaces } =
        await client.getWorkspaces();
      const originalWorkspace = originalWorkspaces.find(w => w.isDisplayed)
        ?.name;

      afterAll(async () => {
        if (originalWorkspace)
          await client.focusWorkspace(originalWorkspace);
      });

      describe('direction', () => {
        it('up', async () => {
          await client.focusDirection('up');
        });
        it('right', async () => {
          await client.focusDirection('right');
        });
        it('down', async () => {
          await client.focusDirection('down');
        });
        it('left', async () => {
          await client.focusDirection('left');
        });
      });
      it('workspace ${workspace}', async () => {
        const NEXT_WORKSPACE_BACKUP_NAME = '2';
        let nextWorkspace: string = NEXT_WORKSPACE_BACKUP_NAME;
        let { workspaces } = await client.getWorkspaces();
        const { name: initialWorkspace } = workspaces.find(
          w => w.isDisplayed,
        )!;

        if (workspaces.length >= 2) {
          // multiple workspaces exist, filter out the existing one and switch to another
          const prunedWorkspaces = workspaces.filter(
            w => w.name !== initialWorkspace,
          );
          if (prunedWorkspaces[0]?.name) {
            nextWorkspace = prunedWorkspaces[0]?.name;
          } else {
            console.warn(
              'ATTENTION: Assumed multiple workspaces and failed to switch to an existing one, revise test logic.',
            );
          }
        }

        await client.focusWorkspace(nextWorkspace);

        // refetch workspaces data
        ({ workspaces } = await client.getWorkspaces());

        const { name: switchedWorkspace } = workspaces.find(
          w => w.isDisplayed,
        )!;

        expect(initialWorkspace).not.toEqual(switchedWorkspace);

        // clean up
        await client.focusWorkspace(initialWorkspace);
      }, 5000);
      it('next_workspace', async () => {
        await client.nextWorkspace();
      });
      it('prev_workspace', async () => {
        await client.prevWorkspace();
      });
      it('recent_workspace', async () => {
        await client.recentWorkspace();
      });
    });
  });
});