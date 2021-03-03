import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

import { MostPickedMovement } from "./dto/most-picked-movement.dto";
import { MostUsedMovesQueryResult } from "./dto/most-used-moves.dto";
import { PercentageCompleteVsIncompleteMatches } from "./dto/percentage-complete-vs-incomplete-matches.dto";
import { PercentageMatchesWonQueryResult } from "./dto/percentage-matches-won.dto";

@Injectable()
export class StatsService {
  constructor(
    @InjectConnection()
    private connection: Connection
  ) {}

  /** PLAYER STATS */
  async mostUsedMovesByPlayer(playerId: number) {
    const playerMovementColumn =
      playerId === 1 ? "playerOneMovementId" : "playerTwoMovementId";
    const playerIdColumn = playerId === 1 ? "playerOneId" : "playerTwoId";
    const mostUsedMoves: MostUsedMovesQueryResult[] = await this.connection.query(
      `SELECT data.count, data.movement, data.player
      FROM (
        SELECT COUNT(rules."name") AS count, rules."name" AS movement, p."name" AS player, RANK() OVER (PARTITION BY p."name"
        ORDER BY COUNT(rules."name") DESC) AS RANK
        FROM ROUND r
        JOIN MATCH m ON m.id = r."matchId"
        JOIN player p ON p.id = m."${playerIdColumn}"
        JOIN rules rules ON rules.id = r."${playerMovementColumn}"
        GROUP BY p."name", rules."name"
        ORDER BY p."name") data
      WHERE RANK = 1`
    );

    const groupByPlayer = mostUsedMoves.reduce<
      Record<string, MostUsedMovesQueryResult[]>
    >((groups, item) => {
      const group = groups[item.player] || [];
      group.push(item);
      groups[item.player] = group;
      return groups;
    }, {});

    return Object.keys(groupByPlayer).map((key) => ({
      player: key,
      mostUsedMovements: groupByPlayer[key].map(({ movement, count }) => ({
        movement,
        count,
      })),
    }));
  }

  async percentageMatchesWonByPlayer(playerId: number) {
    const playerIdColumn = playerId === 1 ? "playerOneId" : "playerTwoId";
    const avgWonByPlayer: PercentageMatchesWonQueryResult[] = await this.connection.query(
      `WITH total_matches AS (
        SELECT COUNT(m.id) AS total, p.name
        FROM MATCH M
        JOIN player p ON p.id = M."${playerIdColumn}"
        GROUP BY p.name
        ), total_wins AS (
        SELECT COUNT(m.id) AS wins, p.name
        FROM MATCH M
        JOIN player p ON p.id = M."${playerIdColumn}"
        WHERE m."winnerId" = p.id
        GROUP BY p.name
        )
      SELECT TRUNC(tw.wins:: NUMERIC / tm.total:: NUMERIC,3) AS percentage, tm.name as player
      FROM total_matches tm
      JOIN total_wins tw ON tw.name = tm.name`
    );

    return avgWonByPlayer;
  }

  /** GAMES STATS */
  async mostPickedMoveFirstRound() {
    const mostPickedMove: MostPickedMovement[] = await this.connection.query(
      `SELECT SUM(DATA.count) as count, r.name
      FROM (
      SELECT COUNT(r."playerOneMovementId") AS COUNT, r."playerOneMovementId" AS movementId
      FROM ROUND r
      WHERE r.round = 1
      GROUP BY r."playerOneMovementId" UNION
      SELECT COUNT(r."playerTwoMovementId") AS COUNT, r."playerTwoMovementId" AS movementId
      FROM ROUND r
      WHERE r.round = 1
      GROUP BY r."playerTwoMovementId") DATA
      JOIN rules r ON r.id = movementId
      GROUP BY r.name
      LIMIT 2`
    );

    return mostPickedMove;
  }

  async averageTimeOfMatches() {
    const avgTime: { avg: Date }[] = await this.connection.query(
      `SELECT AVG(AGE("updatedAt", "createdAt"))
      FROM MATCH`
    );

    if (avgTime && avgTime.length > 0) {
      return avgTime[0].avg;
    }

    return null;
  }

  /** MATCHES STATS */
  async averageQuantityRoundOfCompleteMatches() {
    const avgQty: { avg: number }[] = await this.connection.query(
      `SELECT TRUNC(AVG(DATA.count),3) as avg
      FROM (SELECT COUNT(r.id), m.id
      FROM match M
      JOIN round r ON r."matchId" = m.id
      WHERE M."winnerId" IS NOT NULL
      GROUP BY m.id) data`
    );

    if (avgQty && avgQty.length > 0) {
      return avgQty[0].avg;
    }

    return null;
  }

  async percentageCompleteVsIncompleteMatches() {
    const avgQty: PercentageCompleteVsIncompleteMatches[] = await this.connection.query(
      `SELECT 
      TRUNC(completed_count:: NUMERIC/(completed_count:: NUMERIC + incompleted_count:: NUMERIC),3) AS completed, 
      TRUNC(incompleted_count:: NUMERIC/(completed_count:: NUMERIC + incompleted_count:: NUMERIC),3) AS incompleted
      FROM (
      SELECT COUNT(m.id) AS completed_count, 1 AS col
      FROM MATCH M
      WHERE M."winnerId" IS NOT NULL) completed
      JOIN (
      SELECT COUNT(m.id) AS incompleted_count, 1 AS col
      FROM MATCH M
      WHERE M."winnerId" IS NULL) AS incompleted ON incompleted.col = completed.col`
    );

    if (avgQty && avgQty.length > 0) {
      return avgQty[0];
    }

    return new PercentageCompleteVsIncompleteMatches();
  }
}
