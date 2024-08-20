import GameProvider from '~/components/contexts/GameProvider';
import GameWrapper from '~/components/game/GameWrapper';

export default function Game() {
  return (
    <main class="grow flex flex-col items-center justify-center">
      <GameProvider>
        <GameWrapper />
      </GameProvider>
    </main>
  );
}
