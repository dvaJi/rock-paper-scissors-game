import { Rules } from "../../rules/rules.entity";

export class RoundResponseDto {
  matchId: number;
  playerOneMovement: Rules;
  playerTwoMovement: Rules;
  winner: string;
  round: number;
  matchWinner?: string;
}
