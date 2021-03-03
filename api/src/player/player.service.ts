import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { Player } from "./player.entity";

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>
  ) {}

  async create(player: CreatePlayerDto): Promise<Player> {
    const newPlayer = this.playersRepository.create(player);

    await this.playersRepository.save(newPlayer);
    return newPlayer;
  }

  async findOrCreate(newPlayer: CreatePlayerDto): Promise<Player> {
    const player = await this.findByName(newPlayer.name);
    if (player) {
      return player;
    }

    return await this.create(newPlayer);
  }

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  findByName(name: string): Promise<Player> {
    return this.playersRepository.findOne({ name });
  }
}
