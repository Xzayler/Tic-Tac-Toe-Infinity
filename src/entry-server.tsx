// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

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
