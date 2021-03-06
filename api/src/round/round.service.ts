import { ModuleRef } from "@nestjs/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RulesService } from "@rules/rules.service";
import { MatchService } from "@match/match.service";

import { CreateRoundDto } from "./dto/create-round-dto";
import { RoundResponseDto } from "./dto/round-response";
import { Round, WinnerEnum } from "../round/round.entity";
import { Rules } from "@rules/rules.entity";

@Injectable()
export class RoundService implements OnModuleInit {
  private matchService: MatchService;
  private rulesService: RulesService;

  constructor(
    @InjectRepository(Round)
    private readonly roundRepository: Repository<Round>,
    private moduleRef: ModuleRef
  ) {}

  onModuleInit() {
    this.matchService = this.moduleRef.get(MatchService, { strict: false });
    this.rulesService = this.moduleRef.get(RulesService, { strict: false });
  }

  async createRound(newRound: CreateRoundDto): Promise<RoundResponseDto> {
    const round = new Round();
    const match = await this.matchService.findMatchById(newRound.matchId, [
      "playerOne",
      "playerTwo",
    ]);
    const pOneMovements = await this.rulesService.findRuleByName(
      newRound.playerOneMovement
    );
    const pTwoMovements = await this.rulesService.findRuleByName(
      newRound.playerTwoMovement
    );
    const winnerCondition = this.determineWinner(pOneMovements, pTwoMovements);

    round.match = match;
    round.winner = winnerCondition.winner;
    round.playerOneMovement = winnerCondition.playerOneMovement;
    round.playerTwoMovement = winnerCondition.playerTwoMovement;
    round.round =
      (await this.countFinishedRoundsByMatchId(newRound.matchId)) + 1;

    // Don't save TIE rounds
    if (round.winner !== WinnerEnum.TIE) {
      await this.roundRepository.save(round);
    }

    const response = new RoundResponseDto();
    response.matchId = newRound.matchId;
    response.playerOneMovement = round.playerOneMovement;
    response.playerTwoMovement = round.playerTwoMovement;
    response.round = round.round;
    response.winner = round.winner;

    if (round.round >= 3) {
      // Check if this is the last round.
      const rounds = await this.findFinishedRoundsByMatchId(newRound.matchId);
      const playerOneWins = rounds.filter(
        (r) => r.winner === WinnerEnum.PLAYER_ONE
      );

      const playerTwoWins = rounds.filter(
        (r) => r.winner === WinnerEnum.PLAYER_TWO
      );

      if (playerOneWins.length === 3) {
        this.matchService.finishMatch(newRound.matchId, match.playerOne.id);
        response.matchWinner = match.playerOne.name;
      } else if (playerTwoWins.length === 3) {
        this.matchService.finishMatch(newRound.matchId, match.playerTwo.id);
        response.matchWinner = match.playerTwo.name;
      }
    }

    return response;
  }

  async findFinishedRoundsByMatchId(id: number) {
    return this.roundRepository.find({
      where: [
        { match: { id }, winner: WinnerEnum.PLAYER_ONE },
        { match: { id }, winner: WinnerEnum.PLAYER_TWO },
      ],
    });
  }

  async countFinishedRoundsByMatchId(id: number): Promise<number> {
    return this.roundRepository.count({
      where: [
        { match: { id }, winner: WinnerEnum.PLAYER_ONE },
        { match: { id }, winner: WinnerEnum.PLAYER_TWO },
      ],
    });
  }

  determineWinner(
    playerOneMovement: Rules[] = [],
    playerTwoMovement: Rules[] = []
  ) {
    const obj = {
      winner: WinnerEnum.TIE,
      playerOneMovement: playerOneMovement[0],
      playerTwoMovement: playerTwoMovement[0],
    };

    const pOneKills = playerOneMovement.map((m) => m.kills);
    const pTwoKills = playerTwoMovement.map((m) => m.kills);
    if (pOneKills.includes(playerTwoMovement[0].name)) {
      obj.winner = WinnerEnum.PLAYER_ONE;
      obj.playerOneMovement = playerOneMovement.find(
        (m) => m.kills === playerTwoMovement[0].name
      );
    } else if (pTwoKills.includes(playerOneMovement[0].name)) {
      obj.winner = WinnerEnum.PLAYER_TWO;
      obj.playerTwoMovement = playerTwoMovement.find(
        (m) => m.kills === playerOneMovement[0].name
      );
    }

    return obj;
  }
}
