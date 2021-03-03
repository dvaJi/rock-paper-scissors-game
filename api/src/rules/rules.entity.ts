import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Round } from "@round/round.entity";

@Entity()
export class Rules {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Scissors", description: "Movement name" })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: "Rock", description: "Movement which it defeats" })
  @Column({ nullable: false })
  kills: string;

  @ApiHideProperty()
  @OneToMany(() => Round, (round) => round.playerOneMovement)
  rounds: Round[];

  @ApiHideProperty()
  @OneToMany(() => Round, (round) => round.playerTwoMovement)
  rounds2: Round[];
}
