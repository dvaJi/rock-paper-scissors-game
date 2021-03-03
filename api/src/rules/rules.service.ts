import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateRuleDto } from "./dto/create-rule.dto";
import { Rules } from "./rules.entity";

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rules)
    private readonly movesRepository: Repository<Rules>
  ) {}

  async createRule(newRule: CreateRuleDto): Promise<Rules> {
    const rule = new Rules();
    rule.name = newRule.name;
    rule.kills = newRule.kills;

    return this.movesRepository.save(rule);
  }

  findRuleByName(name: string): Promise<Rules> {
    return this.movesRepository.findOne({ where: { name } });
  }

  findAllRules(): Promise<Rules[]> {
    return this.movesRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.movesRepository.delete(id);
  }
}
