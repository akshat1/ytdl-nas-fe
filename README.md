# ytdl-nas-fe
Web application that runs youtube-dl and saves videos to a directory on the server instead of the client machine. Intended to be used on a home NAS machine. Specifically, _my_ NAS machine.

Also, I wanted to try doing a webapp entirely on WebSockets (fine socket.io, a websocket-_like_ protocol) instead of REST.

WIP: Most of this was done over the previous weekend (Oct 4 - 6), but still need to add some ability to configure download locations and port etc.

Also, need to implement UI bits for showing command output (from youtube-dl) but ran out of weekend.

Features:
- functional but retina burning UI (don't forget your safety squints).
- quick setup. Install youtube-dl, npm install this and go.

To install:
- clone this repo.
- npm install.
- [install youtube-dl](https://ytdl-org.github.io/youtube-dl/download.html)
- npm run start.
- visit http://localhost:4000
