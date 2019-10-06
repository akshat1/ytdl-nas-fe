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
  '--sub-lang',
  'en',
  '--write-description',
  '--write-info-json',
  '--write-annotations',
  '--write-thumbnail',
  url,
  // '-o',
  // `${path.join(dirName, '%(title)s-%(id)s.%(ext)s')}`,
];

// figure out download target on the FS.
// mkdir -p that download target.
// try to cd into that location and then download.

const getFileName = async url => {
  const fileName = (await execFile('youtube-dl', ['--get-filename', url])).stdout.toString();
  return path.basename(fileName, path.extname(fileName));
}

const prepareLocation = dirName =>
  mkdir(dirName, { recursive: true });

const ytdlDownload = ({ item, taskMan, io }) =>
  new Promise(async (resolve, reject) => {
    try {
      const { url } = item;
      // Async func inside a promise because we don't want to resolve until close event occurs.
      const dirName = path.join(process.cwd(), await getFileName(url));
      console.log(`dirName := ${dirName}`);
      await prepareLocation(dirName);
      console.log(`exec: youtube-dl ${getArgs(url, dirName).join(' ')}`);
      const prcs = spawn('youtube-dl', getArgs(url, dirName), { detached: true, cwd: dirName });
      prcs.on('close', () => {
        console.log(`[[Done with ${item.id}]]`);
        resolve();
      });

      const onData = (data) => console.log(`>> ${data}`);

      prcs.stdout.on('data', onData);
      prcs.stderr.on('data', onData);
    } catch (err) {
      console.log('Error occurred', err);
      reject(err);
    }
  });

export default ytdlDownload;
