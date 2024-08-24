import { A } from '@solidjs/router';
import GithubIcon from '~/components/icons/GithubIcon';

export default function Home() {
  return (
    <main class="grow w-full min-h-full flex flex-col justify-center items-center">
      <div class="mb-8">
        <h1 class="text-4xl text-center">
          Tic-Tac-Toe
          <br />
          Infinity
        </h1>
      </div>

      <A
        href="./game"
        class="mb-2 text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition hover:scale-105"
      >
        Start Game
      </A>
      <A
        href="https://github.com/Xzayler/Tic-Tac-Toe-Infinity"
        target="_blank"
        class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition"
      >
        <div class="flex max-w-max max-h-6 gap-1">
          <div class="aspect-square w-6">
            <GithubIcon />
          </div>
          <div>Check the Repo</div>
        </div>
      </A>
    </main>
  );
}
