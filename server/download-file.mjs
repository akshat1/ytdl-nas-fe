import { spawn } from 'child_process';

const getArgs = url => [
  '--write-sub',
  '--write-auto-sub',
  '--sub-lang en',
  '--write-description',
  '--write-info-json',
  '--write-annotations',
  '--write-thumbnail',
  `"${url}"`,
];

const get

const ytdlDownload = ({ item, taskMan, socket }) => {
  const prcs = spawn('youtube-dl', getArgs(url));
  prcs.on('close', code => {
    // emit error for the given URL.
  });

  prcs.on('data', data => {
    // broadcast new data for the URL.
  });
}

export default ytdlDownload;
