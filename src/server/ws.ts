import wsAdapter from 'crossws/adapters/node';
import { defineHooks } from 'crossws';
import { Peer } from 'crossws';
import Game, { type Player } from '~/lib/Game';

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

export type ChatRequest = {
  name: 'chat';
  text: string;
};

type ChatResponse = {
  name: 'chat';
  author: Player;
  text: string;
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

const hooks = defineHooks({
  open(peer) {
    console.log('[ws] open', peer);
    // peer.send(JSON.stringify('connected'));
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

      default:
        break;
    }
  },

  close(peer, event) {
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
