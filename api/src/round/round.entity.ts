import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "@match/match.entity";
import { Rules } from "../rules/rules.entity";

export enum WinnerEnum {
  PLAYER_ONE = "PLAYER_ONE",
  PLAYER_TWO = "PLAYER_TWO",
  TIE = "TIE",
}

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  round: number;

  @ApiProperty({ example: 1, description: "Match id" })
  @ManyToOne(() => Match, (match) => match.rounds)
  match: Match;

  @ApiProperty({ example: 1, description: "Player one movement id" })
  @ManyToOne(() => Rules, (move) => move.rounds)
  playerOneMovement: Rules;

  @ApiProperty({ example: 2, description: "Player two movement id" })
  @ManyToOne(() => Rules, (move) => move.rounds2)
  playerTwoMovement: Rules;

  @ApiProperty({
    example: WinnerEnum.PLAYER_ONE,
    description: "Winning player id",
  })
  @Column({
    type: "enum",
    enum: WinnerEnum,
  })
  winner: WinnerEnum;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;
}
