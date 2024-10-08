import { useGameContext } from '../contexts/GameProvider';
import { Switch, Match, Show, createSignal } from 'solid-js';
import Game from './Game';
import ClipAlert from '../alerts/ClipAlert';
import CopyIcon from '../icons/CopyIcon';
import InputAlert from '../alerts/InputAlert';

export default function GameWrapper() {
  let matchIdEl: HTMLInputElement | undefined;

  const { gameState, joinMatch, createMatch, leaveMatch, searchAgain } =
    useGameContext();

  const [isInvalidInput, setIsInvalidInput] = createSignal<boolean>(false);

  function join() {
    if (
      matchIdEl === undefined ||
      (matchIdEl as HTMLInputElement).value.length == 0 ||
      !/^\d+$/.test((matchIdEl as HTMLInputElement).value)
    ) {
      setIsInvalidInput(true);
      setTimeout(() => setIsInvalidInput(false), 2000);
      return;
    }
    joinMatch(Number(matchIdEl.value));
  }

  const [showClipAlert, setShowClipAlert] = createSignal<boolean>(false);

  return (
    <div class="flex flex-col justify-center items-stretch gap-2 px-2">
      <Switch fallback={<Game />}>
        <Match when={gameState.matchState === null}>
          <button
            class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition"
            onclick={createMatch}
          >
            <span class="font-bold">Create Match</span>
          </button>
          <span class="text-center">or</span>
          <div class="text-center border-4 border-foreground text-foreground rounded-xl group">
            <div class="w-full h-full flex justify-between items-center">
              <input
                type="text"
                ref={matchIdEl}
                placeholder="Insert match code"
                maxLength={13}
                class="h-full bg-background pl-1 outline-none"
              />
              <button
                class="text-center px-2 py-1 hover:text-background hover:bg-foreground transition-colors"
                onclick={join}
              >
                <span class="font-bold">Join</span>
              </button>
            </div>
          </div>
          <Show when={isInvalidInput()}>
            <InputAlert />
          </Show>
        </Match>
        <Match when={gameState.matchState === 'searching'}>
          <div class="flex flex-col gap-1 items-center text-center">
            <p class="font-semibold text-3xl mb-5">Waiting for opponent!</p>
            <div class="flex">
              <p class="text-2xl">{gameState.id}</p>
              <div
                class="cursor-pointer ml-2"
                onclick={() => {
                  navigator.clipboard.writeText(gameState.id.toString());
                  setShowClipAlert(true);
                  setTimeout(() => setShowClipAlert(false), 2000);
                }}
              >
                <div class="text-ui h-6 hover:text-foreground">
                  <CopyIcon />
                </div>
              </div>
            </div>
            <p class="text-center">
              Send this code to another player to join you
            </p>
            <p class="text-sm text-center">
              {'(You can open a new broser tab to play against yourself)'}
            </p>
            <button
              class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition"
              onclick={leaveMatch}
            >
              <span class="font-bold">Cancel</span>
            </button>
            <Show when={showClipAlert()}>
              <ClipAlert />
            </Show>
          </div>
          {/* TODO: Add option to cancel the search */}
        </Match>
        <Match when={gameState.matchState === 'left'}>
          <p class="text-xl text-center">Your opponent left the game</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              onclick={leaveMatch}
              class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition"
            >
              Back to Menu
            </button>
            <button
              onclick={searchAgain}
              class="text-center px-2 py-1 border-4 border-foreground text-foreground rounded-xl hover:bg-foreground hover:text-background transition"
            >
              Wait for another player
            </button>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
