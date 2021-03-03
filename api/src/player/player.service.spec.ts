import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Player } from "./player.entity";
import { PlayerService } from "./player.service";

const playerArray = [
  new Player("Pedro"),
  new Player("Juan"),
  new Player("Diego"),
];

const onePlayer = new Player("Pedro");

describe("PlayerService", () => {
  let service: PlayerService;
  let repo: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn().mockResolvedValue(playerArray),
            findOne: jest.fn().mockResolvedValue(onePlayer),
            create: jest.fn().mockReturnValue(onePlayer),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repo = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("findAll", () => {
    it("should return an array of players", async () => {
      const players = await service.findAll();
      expect(players).toEqual(playerArray);
    });
  });
  describe("findByName", () => {
    it("should get one player", () => {
      const repoSpy = jest.spyOn(repo, "findOne");
      expect(service.findByName("Pedro")).resolves.toEqual(onePlayer);
      expect(repoSpy).toBeCalledWith({ name: "Pedro" });
    });
  });
  describe("create", () => {
    it("should successfully insert a player", () => {
      expect(service.create({ name: "Pedro" })).resolves.toEqual(onePlayer);
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({ name: "Pedro" });
      expect(repo.save).toBeCalledTimes(1);
    });
  });
});
