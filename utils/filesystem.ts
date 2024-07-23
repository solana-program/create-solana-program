import * as fs from 'node:fs';
import * as path from 'node:path';

import { Language } from './localization';
import { logErrorAndExit } from './logs';

export function createOrEmptyTargetDirectory(
  language: Language,
  targetDirectoryName: string,
  shouldOverride: boolean
) {
  const targetDirectory = path.join(process.cwd(), targetDirectoryName);
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  } else if (shouldOverride) {
    emptyGitDirectory(targetDirectory);
  } else {
    logErrorAndExit(
      language.errors.cannotOverrideDirectory.replace(
        '$targetDirectory',
        targetDirectoryName
      )
    );
  }
}

export function emptyGitDirectory(directory: string) {
  traverseGitDirectory(directory, (fullpath) => {
    fs.rmSync(fullpath, { recursive: true });
  });
}

export function traverseGitDirectory(
  directory: string,
  callback: (dir: string) => void
) {
  for (const filename of fs.readdirSync(directory)) {
    if (filename === '.git') continue;
    const fullpath = path.resolve(directory, filename);
    if (fs.lstatSync(fullpath).isDirectory()) {
      traverseGitDirectory(fullpath, callback);
      callback(fullpath);
      continue;
    }
    callback(fullpath);
  }
}
