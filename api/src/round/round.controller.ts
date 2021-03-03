import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { RoundService } from "./round.service";

import { CreateRoundDto } from "./dto/create-round-dto";
import { RoundResponseDto } from "./dto/round-response";

@ApiTags("round")
@Controller("round")
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Post()
  createRound(
    @Body() createRoundDto: CreateRoundDto
  ): Promise<RoundResponseDto> {
    return this.roundService.createRound(createRoundDto);
  }
}
