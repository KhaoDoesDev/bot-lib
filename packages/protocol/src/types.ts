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