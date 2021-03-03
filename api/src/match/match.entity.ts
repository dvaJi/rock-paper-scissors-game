import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Player } from "@player/player.entity";
import { Round } from "@round/round.entity";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: "Player one Id" })
  @ManyToOne(() => Player, (player) => player.matches)
  playerOne: Player;

  @ApiProperty({ example: 2, description: "Player two Id" })
  @ManyToOne(() => Player, (player) => player.matches)
  playerTwo: Player;

  @ApiProperty({ example: "Francisco", description: "Winning player id" })
  @ManyToOne(() => Player, (player) => player.matches)
  winner: Player;

  @OneToMany(() => Round, (round) => round.match)
  rounds: Round[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;
}
