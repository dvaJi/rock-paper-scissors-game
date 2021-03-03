import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StatsService } from "./stats.service";

@ApiTags("stats")
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("player/:player/")
  async playerStats(@Param("player") player: number) {
    if (player <= 0 || player >= 3) {
      throw new HttpException(
        "Player parameter must be 1 or 2",
        HttpStatus.BAD_REQUEST
      );
    }

    const mostUsedMoves = await this.statsService.mostUsedMovesByPlayer(
      Number(player)
    );
    const percentageMatchesWon = await this.statsService.percentageMatchesWonByPlayer(
      Number(player)
    );
    return {
      mostUsedMoves,
      percentageMatchesWon,
    };
  }

  @Get("match")
  async matchStats() {
    const mostUsedMoves = await this.statsService.mostPickedMoveFirstRound();
    const averageTimeOfMatches = await this.statsService.averageTimeOfMatches();
    return {
      mostUsedMoves,
      averageTimeOfMatches,
    };
  }

  @Get("round")
  async roundStats() {
    const avgQuantityRoundsToComplete = await this.statsService.averageQuantityRoundOfCompleteMatches();
    const percentageCompleteVsIncompleteMatches = await this.statsService.percentageCompleteVsIncompleteMatches();
    return {
      avgQuantityRoundsToComplete,
      percentageCompleteVsIncompleteMatches,
    };
  }
}

// FINSIH THISS!!
