export enum Events {
  "packet",
  "connect"
}

export enum Intentions {
  STATUS = 1,
  LOGIN = 2,
  TRANSFER = 3,
}

export enum States {
  HANDSHAKE,
  STATUS,
  LOGIN,
  CONFIG,
  PLAY
}

export enum GameModes {
  SURVIVAL = 0,
  CREATIVE = 1,
  ADVENTURE = 2,
  SPECTATOR = 3
}

export enum Difficulties {
  PEACEFUL = 0,
  EASY = 1,
  NORMAL = 2,
  HARD = 3
}