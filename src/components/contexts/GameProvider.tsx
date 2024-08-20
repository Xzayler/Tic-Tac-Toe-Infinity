import {
  createContext,
  useContext,
  Accessor,
  Setter,
  JSXElement,
  createSignal,
  onMount,
  Show,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Player, GridIndex, CellValue } from '~/lib/Game';
import type {
  MatchState,
  JoinResponse,
  JoinRequest,
  MoveRequest,
  MoveResponse,
} from '~/server/ws';

type GameState = {
  id: number;
  turns: number;
  player: Player;
  activePlayer: Player;
  cells: CellValue[];
  matchState: MatchState | null;
};

type GameContextType = {
  gameState: GameState;
  attemptMove: (index: GridIndex) => void;
  joinMatch: (id: number) => void;
  createMatch: () => void;
};

const GameContext = createContext<GameContextType>();

type WsContext = {
  ws: WebSocket | undefined;
  href: string;
  onOpen: () => void;
  onMessage: (event: MessageEvent<string>) => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
};

function wsConnect(ctx: WsContext) {
  if (ctx.ws) {
    ctx.ws.close();
    ctx.ws = undefined;
  }
  const ws = new WebSocket(ctx.href);

  ws.addEventListener('message', ctx.onMessage);
  ws.addEventListener('open', () => {
    ctx.ws = ws;
    ctx.onOpen();
  });
}

export default function GameProvider(props: { children: JSXElement }) {
  let wsContext: WsContext;
  const connect = () => wsConnect(wsContext);

  const [isConnected, setIsConnected] = createSignal<boolean>(false);
  function onOpen() {
    setIsConnected(true);
  }

  const [gameState, setGameState] = createStore<GameState>({
    turns: 0,
    player: 'x',
    activePlayer: 'x',
    cells: new Array(9).fill(null),
    matchState: null,
    id: 0,
  });

  function handleJoinResp(resp: JoinResponse) {
    switch (resp.response) {
      case 'o':
      case 'x':
        setGameState('player', resp.response);
        setGameState('id', resp.matchId);
        setGameState('matchState', 'searching');
        break;

      case 'full':
        // Match is full
        console.log('match is full');
        break;

      case null:
        // No such match
        console.log("match doesn't exist");
        break;

      default:
        break;
    }
  }

  function handleMoveResp(resp: MoveResponse) {
    const { valid, cell, newState, player, toRemove } = resp;
    if (valid) {
      setGameState('cells', cell, player);
      setGameState('matchState', newState);
      if (toRemove !== null) {
        setGameState('cells', toRemove, null);
      }
      setGameState('activePlayer', player === 'x' ? 'o' : 'x');
    }
  }

  function onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    switch (data.name) {
      case 'join':
        handleJoinResp(data);
        break;
      case 'start':
        setGameState('matchState', 'ongoing');
        break;
      case 'move':
        handleMoveResp(data);
        break;

      default:
        break;
    }
  }

  onMount(() => {
    wsContext = {
      ws: undefined,
      href: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${
        location.host
      }/api/_ws/`,
      onOpen,
      onMessage,
      send: (data) => wsContext.ws?.send(data),
    };
    connect();
  });

  function createMatch() {
    const req: JoinRequest = { name: 'join', matchId: null };
    wsContext.send(JSON.stringify(req));
  }

  function joinMatch(id: number) {
    const req: JoinRequest = {
      name: 'join',
      matchId: id,
    };
    wsContext.send(JSON.stringify(req));
  }

  function attemptMove(index: GridIndex) {
    const req: MoveRequest = {
      name: 'move',
      cell: index,
    };
    wsContext.send(JSON.stringify(req));
  }

  const contextVal = {
    gameState,
    createMatch,
    joinMatch,
    attemptMove,
  };

  return (
    <GameContext.Provider value={contextVal}>
      <Show
        when={isConnected()}
        fallback={
          <div class="w-full h-full text-center bg-background text-foreground text-xl">
            Loading...
          </div>
        }
      >
        {props.children}
      </Show>
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error(
      'Use this function only within a GameStateContext provider',
    );
  }
  return context;
}
