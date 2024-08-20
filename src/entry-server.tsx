// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';
import { websocket } from './server/ws';
import type { IncomingMessage } from 'node:http';

// Code section from https://github.com/peerreynders/solid-start-ws-demo
const emptyBuffer = Buffer.from('');
const handleUpgrade = (request: IncomingMessage) =>
  websocket.handleUpgrade(request, request.socket, emptyBuffer);

const isWsConnect = ({ headers }: IncomingMessage) =>
  headers['connection']?.toLowerCase().includes('upgrade') &&
  headers['upgrade'] === 'websocket' &&
  headers['sec-websocket-version'] === '13' &&
  typeof headers['sec-websocket-key'] === 'string';

export { handleUpgrade, isWsConnect };
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="bg-background text-foreground">
          <div id="app" class="min-h-dvh flex flex-col items-stretch">
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
