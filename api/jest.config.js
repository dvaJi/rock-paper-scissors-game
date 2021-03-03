module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "@match/(.*)": "<rootDir>/src/match/$1",
    "@player/(.*)": "<rootDir>/src/player/$1",
    "@round/(.*)": "<rootDir>/src/round/$1",
    "@rules/(.*)": "<rootDir>/src/rules/$1",
  },
};
