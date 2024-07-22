import { spawn, ChildProcess, SpawnOptions } from 'node:child_process';

export function spawnCommand(
  command: string,
  args: string[] = [],
  options?: SpawnOptions
): ChildProcess {
  return spawn(command, args, { ...options });
}

export async function hasCommand(command: string): Promise<boolean> {
  try {
    await waitForCommand(spawnCommand('which', [command], { stdio: 'ignore' }));
    return true;
  } catch {
    return false;
  }
}

export async function waitForCommand(child: ChildProcess): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(child);
    const errorLogs: string[] = [];
    child.stderr?.on('data', (data) => {
      errorLogs.push(data.toString());
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.log(errorLogs.join(''));
        const message = `$(${child}) exited with code ${code}`;
        reject(new Error(message));
      } else {
        resolve(code);
      }
    });
  });
}

export async function readStdout(child: ChildProcess): Promise<string[]> {
  const stdout: string[] = [];
  return new Promise((resolve) => {
    child.stdout?.on('data', (data) => {
      stdout.push(data.toString());
    });
    child.on('close', () => resolve(stdout));
  });
}
