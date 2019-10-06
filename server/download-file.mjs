import * as childProcess from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const { spawn } = childProcess;
const execFile = promisify(childProcess.execFile);
const mkdir = promisify(fs.mkdir);

const SpawnOpts = {
  detached: true,
};

const getArgs = (url, dirName) => [
  '--write-sub',
  '--write-auto-sub',
  '--sub-lang en',
  '--write-description',
  '--write-info-json',
  '--write-annotations',
  '--write-thumbnail',
  `"${url}"`,
  // '-o',
  // `${path.join(dirName, '%(title)s-%(id)s.%(ext)s')}`,
];

// figure out download target on the FS.
// mkdir -p that download target.
// try to cd into that location and then download.

const getFileName = async url =>
  (await execFile(`youtube-dl --get-filename "${url}"`)).toString();

const prepareLocation = dirName =>
  mkdir(path.join(process.cwd, dirName), { recursive: true });

const ytdlDownload = async ({ item, taskMan, io }) =>
  new Promise((resolve, reject) => {
    const dirName = await getFileName(item.url);
    await prepareLocation(dirName);
    const prcs = spawn('youtube-dl', getArgs(url, dirName), { detached: true, cwd: dirName });
    prcs.on('close', () => {
      console.log(`[[Done with ${item.id}]]`);
      resolve();
    });

    const onData = (data) => console.log(`>> ${data}`);

    prcs.stdout.on('data', onData);
    prcs.stderr.on('data', onData);
  });

export default ytdlDownload;
