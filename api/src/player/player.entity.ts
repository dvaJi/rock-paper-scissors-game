import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Match } from "@match/match.entity";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Francisco", description: "Player name" })
  @Column({ nullable: false })
  name: string;

  @ApiHideProperty()
  @OneToMany(() => Match, (match) => match.playerOne)
  matches: Match[];

  @ApiHideProperty()
  @OneToMany(() => Match, (match) => match.playerTwo)
  matches2: Match[];

  @ApiHideProperty()
  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(name: string) {
    this.name = name;
  }
}
