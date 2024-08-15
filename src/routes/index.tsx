// import { createAsync, type RouteDefinition } from '@solidjs/router';

// export const route = {
//   preload() {
//     getUser();
//   },
// } satisfies RouteDefinition;

export default function Home() {
  // const user = createAsync(() => getUser(), { deferStream: true });
  return (
    <main class="w-full min-h-full">
      <h1>TIC-TAC-TOE</h1>
    </main>
  );
}
