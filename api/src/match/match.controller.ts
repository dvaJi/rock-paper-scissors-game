import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateMatchDto } from "./dto/create-match.dto";
import { Match } from "./match.entity";
import { MatchService } from "./match.service";

@ApiTags("match")
@Controller("match")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Match> {
    return this.matchService.findMatchById(id, [
      "playerOne",
      "playerTwo",
      "rounds",
      "winner",
    ]);
  }
}
