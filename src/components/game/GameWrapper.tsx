import { useGameContext } from '../contexts/GameProvider';
import { Switch, Match, createEffect } from 'solid-js';
import Game from './Game';

export default function GameWrapper() {
  let matchIdEl: HTMLInputElement | undefined;

  const { gameState, joinMatch, createMatch } = useGameContext();

  function join() {
    if (
      matchIdEl === undefined ||
      (matchIdEl as HTMLInputElement).value.length == 0
    )
      return;
    joinMatch(Number(matchIdEl.value));
  }

  return (
    <div class="flex flex-col justify-center items-center gap-2">
      <Switch fallback={<Game />}>
        <Match when={gameState.matchState === null}>
          <button onclick={createMatch}>Create</button>
          <div>
            <input type="text" ref={matchIdEl} />
            <button onclick={join}>Join</button>
          </div>
        </Match>
        <Match when={gameState.matchState === 'searching'}>
          <p>{`Id: ${gameState.id}`}</p>
          <div>Searching for players</div>
          {/* TODO: Add option to cancel the search */}
        </Match>
      </Switch>
    </div>
  );
}
