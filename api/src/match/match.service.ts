import { ModuleRef } from "@nestjs/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";

import { Match } from "./match.entity";

import { PlayerService } from "@player/player.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { Round, WinnerEnum } from "../round/round.entity";

@Injectable()
export class MatchService implements OnModuleInit {
  private playersService: PlayerService;

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private moduleRef: ModuleRef
  ) {}

  onModuleInit() {
    this.playersService = this.moduleRef.get(PlayerService, { strict: false });
  }

  async createMatch(newMatch: CreateMatchDto): Promise<Match> {
    const match = new Match();
    match.playerOne = await this.playersService.findOrCreate({
      name: newMatch.playerOne,
    });
    match.playerTwo = await this.playersService.findOrCreate({
      name: newMatch.playerTwo,
    });

    return this.matchRepository.save(match);
  }

  async finishMatch(id: number, winnerId: number): Promise<UpdateResult> {
    return this.matchRepository.update(id, { winner: { id: winnerId } });
  }

  async findMatchById(id: number, relations: string[]): Promise<Match> {
    if (relations) {
      return this.matchRepository.findOne(id, {
        relations,
      });
    }

    return this.matchRepository.findOne(id);
  }

  determineWinner(round: Round) {
    if (round.playerOneMovement.kills === round.playerTwoMovement.name) {
      return WinnerEnum.PLAYER_ONE;
    } else if (round.playerTwoMovement.kills === round.playerOneMovement.name) {
      return WinnerEnum.PLAYER_TWO;
    }

    return WinnerEnum.TIE;
  }
}
