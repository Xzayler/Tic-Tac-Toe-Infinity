// import { createAsync, type RouteDefinition } from '@solidjs/router';
import { A } from '@solidjs/router';

// export const route = {
//   preload() {
//     getUser();
//   },
// } satisfies RouteDefinition;

export default function Home() {
  // const user = createAsync(() => getUser(), { deferStream: true });
  return (
    <main class="grow w-full min-h-full flex flex-col justify-center items-center gap-8">
      <div>
        <h1 class="text-4xl text-center">
          Tic-Tac-Toe
          <br />
          Infinity
        </h1>
      </div>

      <A
        href="/game"
        class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition hover:scale-105"
      >
        Start Game
      </A>
    </main>
  );
}
