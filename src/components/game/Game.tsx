import { Switch, Match } from 'solid-js';
import { useGameContext } from '../contexts/GameProvider';
import Grid from './Grid';

export default function LocalPlay() {
  const { gameState } = useGameContext();

  return (
    <>
      <div class="text-4xl mb-4">
        <Switch>
          <Match when={gameState.matchState === 'ongoing'}>
            <p
              class={
                gameState.activePlayer === 'x' ? 'text-cross' : 'text-circle'
              }
            >
              {gameState.activePlayer.toUpperCase() + "'s turn"}
            </p>
          </Match>
          <Match when={gameState.matchState === 'ow'}>
            <p class="text-circle">O WON!</p>
          </Match>
          <Match when={gameState.matchState === 'xw'}>
            <p class="text-cross">X WON!</p>
          </Match>
          <Match when={gameState.matchState === 'left'}>
            <p class="text-foreground">Your opponent has left the game</p>
          </Match>
        </Switch>
      </div>
      <div class="max-w-xl w-full max-h-[90dvh] aspect-square p-4 bg-highlight rounded-2xl">
        <Grid />
      </div>
    </>
  );
}
