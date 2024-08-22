import wsAdapter from 'crossws/adapters/node';
import { defineHooks } from 'crossws';
import { Peer } from 'crossws';
import Game, { GridIndex, type Player } from '~/lib/Game';

// These types are here mainly for to see what kind of requests and responses the app uses

export type JoinRequest = {
  name: 'join';
  matchId: number | null;
};

export type JoinResponse = {
  name: 'join';
  response: 'x' | 'o' | 'full' | null;
  matchId: number;
};

type StartResponse = {
  name: 'start';
};

export type MoveRequest = {
  name: 'move';
  cell: GridIndex;
};

export type MoveResponse = {
  name: 'move';
  cell: GridIndex;
  player: Player;
  valid: boolean;
  newState: MatchState;
  toRemove: GridIndex | null;
};

export type ChatRequest = {
  name: 'chat';
  text: string;
};

type ChatResponse = {
  name: 'chat';
  author: Player;
  text: string;
};

export type LeaveReq = {
  name: 'leave';
};

type OpponentLeftResp = {
  name: 'left';
};

export type RestartReq = {
  name: 'restart';
};

export type MatchState = 'searching' | 'ongoing' | 'left' | 'xw' | 'ow';

type Match = {
  x?: Peer;
  o?: Peer;
  game: Game;
  matchingStatus: MatchState;
};

const matches = new Map<number, Match>();

const joinedPlayers = new Map<string, number>();

function handleJoinRequest(peer: Peer, req: JoinRequest) {
  // check if player is already in a Match
  if (joinedPlayers.get(peer.id)) {
    return;
  }

  const matchId = req.matchId;
  // If trying to join
  if (matchId !== null) {
    const match = matches.get(matchId);
    // If match doesn't exist yet
    if (!match) {
      peer.send(
        JSON.stringify({
          name: 'join',
          response: null,
          matchId,
        } as JoinResponse),
      );
      return;
    }
    // If match is not looking for participants anymore
    if (match.matchingStatus !== 'searching') {
      peer.send(
        JSON.stringify({
          name: 'join',
          response: 'full',
          matchId,
        } as JoinResponse),
      );
      return;
    }

    // If match is searching

    const playerSymbol = match.x ? 'o' : 'x';
    match[playerSymbol] = peer;

    joinedPlayers.set(peer.id, matchId);
    const matchIdString = matchId.toString();
    peer.subscribe(matchIdString);

    match.matchingStatus = 'ongoing';

    // Send a response
    const resp: JoinResponse = {
      name: 'join',
      response: playerSymbol,
      matchId,
    };
    const startResp: StartResponse = { name: 'start' };
    peer.send(JSON.stringify(resp));
    peer.send(JSON.stringify(startResp));
    peer.publish(matchIdString, JSON.stringify(startResp));
  } else {
    // Create a new match
    const match: Match = { game: new Game(), matchingStatus: 'searching' };

    const playerSymbol = Math.floor(Math.random() * 2) === 0 ? 'x' : 'o';
    match[playerSymbol] = peer;

    const matchId = new Date().valueOf();

    // player is now in a game
    joinedPlayers.set(peer.id, matchId);
    peer.subscribe(matchId.toString());

    //Match is now created
    matches.set(matchId, match);
    peer.send(
      JSON.stringify({
        name: 'join',
        response: playerSymbol,
        matchId,
      } as JoinResponse),
    );
  }
}

function handleChatMessage(peer: Peer, req: ChatRequest) {
  const matchId = joinedPlayers.get(peer.id);
  if (matchId === undefined) return;
  const match = matches.get(matchId);
  if (match === undefined) return;
  let author: Player = match.x == peer ? 'x' : 'o';
  const resp: ChatResponse = { name: 'chat', author, text: req.text };
  peer.publish(matchId.toString(), resp);
  peer.send(resp);
}

function handleMoveResquest(peer: Peer, req: MoveRequest) {
  const matchId = joinedPlayers.get(peer.id);
  // return if player is not in a match
  if (!matchId) return;

  // These two checks should always pass if everything was
  const match = matches.get(matchId);
  if (!match || match.matchingStatus !== 'ongoing') return;
  const playerSymbol = match.o === peer ? 'o' : match.x === peer ? 'x' : null;
  if (!playerSymbol) return;

  const game = match.game;

  // Check if it's the peer's turn
  if (game.getCurrPlayer() !== playerSymbol || game.isGameOver) return;

  let res: MoveResponse;
  // If the move was valid
  if (game.move(req.cell)) {
    res = {
      name: 'move',
      cell: req.cell,
      valid: true,
      player: playerSymbol,
      newState: game.isGameOver ? `${playerSymbol}w` : 'ongoing',
      toRemove: game.getRemoved(),
    };
  } else {
    res = {
      name: 'move',
      cell: req.cell,
      valid: false,
      player: playerSymbol,
      newState: 'ongoing',
      toRemove: null,
    };
  }
  peer.publish(matchId.toString(), res);
  peer.send(res);
}

function cleanUp(peer: Peer) {
  const matchId = joinedPlayers.get(peer.id);
  if (matchId === undefined) {
    return;
  }
  joinedPlayers.delete(peer.id);
  peer.unsubscribe(matchId.toString());
  const match = matches.get(matchId);
  if (match === undefined) {
    matches.delete(matchId);
    return;
  }

  let playerSymbol: Player;
  let opponentSymbol: Player;

  if (match.x === peer) {
    playerSymbol = 'x';
    opponentSymbol = 'o';
  } else if (match.o === peer) {
    playerSymbol = 'o';
    opponentSymbol = 'x';
  } else {
    return;
  }
  match[playerSymbol] = undefined;
  if (match[opponentSymbol] === undefined) {
    matches.delete(matchId);
    return;
  }
  match.matchingStatus = 'left';
  const resp: OpponentLeftResp = {
    name: 'left',
  };
  peer.publish(matchId.toString(), resp);
}

function restartSearch(peer: Peer) {
  const matchId = joinedPlayers.get(peer.id);
  if (matchId === undefined) {
    joinedPlayers.delete(peer.id);
    return;
  }

  const match = matches.get(matchId);
  if (match === undefined) {
    joinedPlayers.delete(peer.id);
    return;
  }

  // if (match.matchingStatus === 'searching') {
  //   const resp: JoinResponse = {
  //     name: 'join',
  //     matchId: matchId,
  //     response:
  //   }
  // }

  match.game.reset();
  match.matchingStatus = 'searching';
  const resp: JoinResponse = {
    name: 'join',
    matchId: matchId,
    response: match.x === peer ? 'x' : 'o',
  };

  peer.send(resp);
}

const hooks = defineHooks({
  open(peer) {
    console.log('[ws] open', peer);
  },

  message(peer, message) {
    const req = JSON.parse(message.text());
    switch (req.name) {
      case 'join':
        handleJoinRequest(peer, req);
        break;

      case 'chat':
        handleChatMessage(peer, req);
        break;

      case 'move':
        handleMoveResquest(peer, req);
        break;

      case 'leave':
        cleanUp(peer);
        break;

      case 'restart':
        restartSearch(peer);
        break;

      default:
        break;
    }
  },

  close(peer, event) {
    cleanUp(peer);
    console.log('[ws] close', peer, event);
  },

  error(peer, error) {
    console.log('[ws] error', peer, error);
  },

  upgrade(req) {
    return {
      headers: {},
    };
  },
});

export const websocket = wsAdapter({
  hooks,
});
