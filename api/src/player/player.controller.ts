import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PlayerService } from "./player.service";

import { CreatePlayerDto } from "./dto/create-player.dto";
import { Player } from "./player.entity";

export type PlayerSimple = Pick<Player, "id" | "name">;

@ApiTags("player")
@Controller("player")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerService.create(createPlayerDto);
  }

  @Post()
  findOrCreate(
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<PlayerSimple> {
    return this.playerService.findOrCreate(createPlayerDto);
  }

  @Get()
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get(":name")
  findOne(@Param("name") name: string): Promise<Player> {
    return this.playerService.findByName(name);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.playerService.remove(id);
  }
}
