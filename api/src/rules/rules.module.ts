import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Rules } from "./rules.entity";
import { RulesController } from "./rules.controller";
import { RulesService } from "./rules.service";

@Module({
  imports: [TypeOrmModule.forFeature([Rules])],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
