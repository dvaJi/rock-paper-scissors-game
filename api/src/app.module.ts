import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchModule } from "./match/match.module";
import { PlayerModule } from "./player/player.module";
import { RulesModule } from "./rules/rules.module";
import { RoundModule } from "./round/round.module";
import { StatsModule } from "./stats/stats.module";

import * as path from "path";

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, "config/**/!(*.d).{ts,js}")),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get("database"),
      inject: [ConfigService],
    }),
    PlayerModule,
    MatchModule,
    RulesModule,
    RoundModule,
    StatsModule,
  ],
})
export class AppModule {}
