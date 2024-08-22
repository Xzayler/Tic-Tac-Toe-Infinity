import { For } from 'solid-js';
import Cell from './Cell';
import { useGameContext } from '../contexts/GameProvider';
import { GridIndex } from '~/lib/Game';

export default function Grid() {
  const { gameState, attemptMove } = useGameContext();
  return (
    <div class="w-full aspect-square grid grid-cols-3 grid-rows-3 gap-2 bg-ui ">
      <For each={gameState.cells}>
        {(cell, i) => {
          return (
            <div
              class="w-full h-full"
              onclick={() => {
                if (
                  cell === null &&
                  gameState.matchState === 'ongoing' &&
                  gameState.activePlayer == gameState.player
                ) {
                  attemptMove(i() as GridIndex);
                }
              }}
            >
              <Cell value={cell} />
            </div>
          );
        }}
      </For>
    </div>
  );
}
