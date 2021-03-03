import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Round } from "./round.entity";
import { RoundService } from "./round.service";

const roundArray = [new Round(), new Round(), new Round()];

const oneRound = new Round();

describe("RoundService", () => {
  let service: RoundService;
  let repo: Repository<Round>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoundService,
        {
          provide: getRepositoryToken(Round),
          useValue: {
            find: jest.fn().mockResolvedValue(roundArray),
            findOne: jest.fn().mockResolvedValue(oneRound),
            create: jest.fn().mockReturnValue(oneRound),
            save: jest.fn(),
            count: jest.fn().mockReturnValue(2),
          },
        },
      ],
    }).compile();

    service = module.get<RoundService>(RoundService);
    repo = module.get<Repository<Round>>(getRepositoryToken(Round));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findFinishedRoundsByMatchId", () => {
    it("should get finished rounds", async () => {
      const players = await service.findFinishedRoundsByMatchId(1);
      expect(players).toEqual(roundArray);
    });
  });
  describe("countFinishedRoundsByMatchId", () => {
    it("should successfully insert a player", () => {
      expect(service.countFinishedRoundsByMatchId(1)).resolves.toEqual(2);
      expect(repo.count).toBeCalledTimes(1);
    });
  });
  describe("determineWinner", () => {
    it("should successfully determine winner", () => {
      const playerOneMovement = [
        {
          id: 1,
          name: "Rock",
          kills: "Scissors",
          rounds: [],
          rounds2: [],
        },
      ];
      const playerTwoMovement = [
        {
          id: 2,
          name: "Scissors",
          kills: "Paper",
          rounds: [],
          rounds2: [],
        },
      ];
      expect(
        service.determineWinner(playerOneMovement, playerTwoMovement)
      ).toEqual({
        winner: "PLAYER_ONE",
        playerOneMovement: playerOneMovement[0],
        playerTwoMovement: playerTwoMovement[0],
      });
    });

    it("should successfully determine winner", () => {
      const playerOneMovements = [
        {
          id: 3,
          name: "Rock",
          kills: "String",
          rounds: [],
          rounds2: [],
        },
        {
          id: 1,
          name: "Rock",
          kills: "Scissors",
          rounds: [],
          rounds2: [],
        },
      ];
      const playerTwoMovements = [
        {
          id: 2,
          name: "Scissors",
          kills: "Paper",
          rounds: [],
          rounds2: [],
        },
      ];
      expect(
        service.determineWinner(playerOneMovements, playerTwoMovements)
      ).toEqual({
        winner: "PLAYER_ONE",
        playerOneMovement: playerOneMovements[1],
        playerTwoMovement: playerTwoMovements[0],
      });
    });
  });
});
