import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { RulesService } from "./rules.service";

import { CreateRuleDto } from "./dto/create-rule.dto";
import { Rules } from "./rules.entity";

@ApiTags("rules")
@Controller("rules")
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Put()
  createMovement(@Body() createRuleDto: CreateRuleDto): Promise<Rules> {
    return this.rulesService.createRule(createRuleDto);
  }

  @Get()
  findAllMovement(): Promise<Rules[]> {
    return this.rulesService.findAllRules();
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Partial<Rules>> {
    await this.rulesService.remove(id);
    return {
      id: Number(id),
    };
  }
}
