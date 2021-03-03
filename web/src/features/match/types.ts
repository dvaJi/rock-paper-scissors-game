export interface Round {
  playerOneMove: string;
  playerTwoMove: string;
  round: number;
  winner?: string;
}

export interface PushRound {
  matchId: number;
  playerOneMovement: string;
  playerTwoMovement: string;
}

export interface Player {
  id: number;
  name: string;
}

export interface CreateMatchResponse {
  id: number;
  playerOne: Player;
  playerTwo: Player;
}

export interface RoundResponse extends Round {
  matchId: number;
  matchWinner?: string;
}

export interface FetchMatchResponse {
  id: number;
  playerOne: Player;
  playerTwo: Player;
  winner?: { name: string };
  rounds?: Round[];
}
